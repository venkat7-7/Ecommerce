from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CartItem, Product, User
from ..schemas import CartItemAdd, CartItemUpdate, CartItemOut, CartOut
from ..utils.deps import get_current_user

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])

@router.get("", response_model=CartOut)
async def view_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    
    # Calculate cart total
    total = Decimal("0.00")
    for item in cart_items:
        total += item.quantity * item.product.price
        
    return {
        "items": cart_items,
        "total": total
    }

@router.post("", response_model=CartItemOut, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    cart_in: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if product exists and is active
    product = db.query(Product).filter(Product.id == cart_in.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
        
    # Check if quantity requested is within available stock
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == cart_in.product_id
    ).first()
    
    requested_qty = cart_in.quantity
    if existing_item:
        requested_qty += existing_item.quantity
        
    if product.stock_quantity < requested_qty:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot add requested quantity. Available stock: {product.stock_quantity}"
        )
        
    if existing_item:
        existing_item.quantity = requested_qty
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        new_item = CartItem(
            user_id=current_user.id,
            product_id=cart_in.product_id,
            quantity=cart_in.quantity
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item

@router.put("/{item_id}", response_model=CartItemOut)
async def update_cart_item(
    item_id: int,
    cart_in: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
        
    # Verify stock of the product
    product = cart_item.product
    if product.stock_quantity < cart_in.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot update to requested quantity. Available stock: {product.stock_quantity}"
        )
        
    cart_item.quantity = cart_in.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
        
    db.delete(cart_item)
    db.commit()
    return None

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete(synchronize_session=False)
    db.commit()
    return None
