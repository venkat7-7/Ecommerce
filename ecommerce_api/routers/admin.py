import csv
from io import StringIO
from typing import List, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Product, Order, User, PromoCode
from ..schemas import (
    ProductCreate, ProductUpdate, ProductOut,
    OrderOut, OrderStatusUpdate, UserOut, DashboardOut,
    PromoCodeCreate, PromoCodeOut, PromoCodeStatusUpdate
)
from ..utils.deps import require_admin

# Require admin role for all endpoints in this router
router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])

# -------------------------------------------------------------
# PRODUCTS CRUD
# -------------------------------------------------------------
@router.get("/products", response_model=List[ProductOut])
async def admin_list_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

@router.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def admin_create_product(product_in: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(**product_in.model_dump())
    from ..utils.embeddings import get_embedding
    text_to_embed = f"{new_product.name} {new_product.category} {new_product.description or ''}"
    new_product.embedding = get_embedding(text_to_embed)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.put("/products/{id}", response_model=ProductOut)
async def admin_update_product(id: int, product_in: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
        
    name_changed = product_in.name is not None and product_in.name != product.name
    category_changed = product_in.category is not None and product_in.category != product.category
    description_changed = product_in.description is not None and product_in.description != product.description

    for field, value in product_in.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
        
    if name_changed or category_changed or description_changed:
        from ..utils.embeddings import get_embedding
        text_to_embed = f"{product.name} {product.category} {product.description or ''}"
        product.embedding = get_embedding(text_to_embed)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{id}", response_model=ProductOut)
async def admin_soft_delete_product(id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
        
    product.is_active = False
    db.commit()
    db.refresh(product)
    return product

# -------------------------------------------------------------
# ORDERS MANAGEMENT
# -------------------------------------------------------------
@router.get("/orders", response_model=List[OrderOut])
async def admin_list_orders(status_filter: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Order)
    if status_filter:
        query = query.filter(Order.status == status_filter.strip().lower())
    orders = query.order_by(Order.created_at.desc()).all()
    return orders

@router.put("/orders/{id}/status", response_model=OrderOut)
async def admin_update_order_status(id: int, status_in: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
        
    new_status = status_in.status.strip().lower()
    allowed_statuses = ("pending", "confirmed", "shipped", "delivered", "cancelled")
    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status must be one of: {', '.join(allowed_statuses)}"
        )
        
    order.status = new_status
    db.commit()
    db.refresh(order)
    return order

# -------------------------------------------------------------
# USERS LIST
# -------------------------------------------------------------
@router.get("/users", response_model=List[UserOut])
async def admin_list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

# -------------------------------------------------------------
# DASHBOARD METRICS
# -------------------------------------------------------------
@router.get("/dashboard", response_model=DashboardOut)
async def admin_get_dashboard(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()
    
    # Revenue is computed from orders that are not cancelled
    revenue_res = db.query(func.sum(Order.total)).filter(Order.status != "cancelled").scalar()
    total_revenue = Decimal(str(revenue_res)) if revenue_res is not None else Decimal("0.00")
    
    total_users = db.query(User).count()
    total_products = db.query(Product).count()
    
    low_stock = db.query(Product).filter(
        Product.stock_quantity < 5,
        Product.is_active == True
    ).all()
    
    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "total_users": total_users,
        "total_products": total_products,
        "low_stock_products": low_stock
    }

# -------------------------------------------------------------
# CSV EXPORT
# -------------------------------------------------------------
@router.get("/orders/export")
async def admin_export_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    
    f = StringIO()
    writer = csv.writer(f)
    
    # CSV Header
    writer.writerow([
        "Order ID", "Order Number", "User ID", "User Name", "User Email",
        "Subtotal", "Discount", "Total", "Promo Code Used",
        "Shipping Name", "Shipping Address", "Shipping City", "Shipping State", "Shipping Zip",
        "Payment Method", "Status", "Created At"
    ])
    
    for order in orders:
        writer.writerow([
            order.id,
            order.order_number,
            order.user_id,
            order.user.full_name,
            order.user.email,
            order.subtotal,
            order.discount,
            order.total,
            order.promo_code or "None",
            order.shipping_name,
            order.shipping_address,
            order.shipping_city,
            order.shipping_state,
            order.shipping_zip,
            order.payment_method,
            order.status,
            order.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])
        
    content = f.getvalue()
    f.close()
    
    return Response(
        content=content,
        media_type="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=orders.csv",
            "Cache-Control": "no-cache"
        }
    )

# -------------------------------------------------------------
# PROMO CODES CRUD
# -------------------------------------------------------------
@router.post("/promo", response_model=PromoCodeOut, status_code=status.HTTP_201_CREATED)
async def admin_create_promo(promo_in: PromoCodeCreate, db: Session = Depends(get_db)):
    # Check if duplicate code
    existing_promo = db.query(PromoCode).filter(PromoCode.code == promo_in.code).first()
    if existing_promo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Promo code {promo_in.code} already exists"
        )
        
    new_promo = PromoCode(**promo_in.model_dump())
    db.add(new_promo)
    db.commit()
    db.refresh(new_promo)
    return new_promo

@router.get("/promo", response_model=List[PromoCodeOut])
async def admin_list_promo_codes(db: Session = Depends(get_db)):
    promos = db.query(PromoCode).all()
    return promos

@router.put("/promo/{id}", response_model=PromoCodeOut)
async def admin_update_promo_status(id: int, status_in: PromoCodeStatusUpdate, db: Session = Depends(get_db)):
    promo = db.query(PromoCode).filter(PromoCode.id == id).first()
    if not promo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Promo code not found"
        )
        
    promo.is_active = status_in.is_active
    db.commit()
    db.refresh(promo)
    return promo
