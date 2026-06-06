from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Wishlist, Product, User
from ..schemas import WishlistAdd, WishlistOut
from ..utils.deps import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

@router.get("", response_model=List[WishlistOut])
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).all()
    return items

@router.post("", response_model=WishlistOut, status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    wish_in: WishlistAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify product exists and is active
    product = db.query(Product).filter(Product.id == wish_in.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
        
    # Check if duplicate
    existing_wish = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == wish_in.product_id
    ).first()
    
    if existing_wish:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product is already in your wishlist"
        )
        
    new_wish = Wishlist(
        user_id=current_user.id,
        product_id=wish_in.product_id
    )
    
    db.add(new_wish)
    db.commit()
    db.refresh(new_wish)
    
    return new_wish

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wish = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.product_id == product_id
    ).first()
    
    if not wish:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found in your wishlist"
        )
        
    db.delete(wish)
    db.commit()
    return None
