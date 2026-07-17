from typing import Optional, List
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..database import get_db
from ..models import Product
from ..schemas import ProductOut

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductOut])
async def list_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    sort_by: Optional[str] = None,
    semantic: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if category:
        query = query.filter(Product.category == category)
        
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
        
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
        
    # If AI search is requested and keyword is provided
    if semantic and search:
        from ..utils.embeddings import get_embedding, cosine_similarity
        query_vector = get_embedding(search)
        if query_vector is not None:
            products = query.all()
            scored_products = []
            for p in products:
                score = cosine_similarity(query_vector, p.embedding) if p.embedding else 0.0
                scored_products.append((p, score))
            # Sort by cosine similarity in descending order
            scored_products.sort(key=lambda x: x[1], reverse=True)
            return [sp[0] for sp in scored_products]
        # Fall back to standard search if Gemini API is unavailable or missing keys

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_filter),
                Product.description.ilike(search_filter)
            )
        )
        
    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.id.asc())
        
    return query.all()

@router.get("/categories", response_model=List[str])
async def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Product.category).filter(Product.is_active == True).distinct().all()
    return [c[0] for c in categories if c[0]]

@router.get("/{id}", response_model=ProductOut)
async def get_product_detail(id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id, Product.is_active == True).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product
