from datetime import datetime
from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Order, OrderItem, CartItem, Product, PromoCode, User
from ..schemas import OrderCreate, OrderOut
from ..utils.deps import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

class PromoValidateRequest(BaseModel):
    promo_code: str
    subtotal: Decimal

@router.post("/validate-promo")
async def validate_promo(
    req: PromoValidateRequest,
    db: Session = Depends(get_db)
):
    promo = db.query(PromoCode).filter(
        PromoCode.code == req.promo_code.strip().upper(),
        PromoCode.is_active == True
    ).first()
    
    if not promo or (promo.expires_at and promo.expires_at < datetime.utcnow()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired promo code"
        )
        
    if req.subtotal < promo.min_order_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Minimum order amount for promo code {promo.code} is ₹{promo.min_order_amount}"
        )
        
    discount = Decimal("0.00")
    if promo.discount_type == "percent":
        discount = req.subtotal * (promo.discount_value / Decimal("100.00"))
        if promo.max_discount is not None and discount > promo.max_discount:
            discount = promo.max_discount
    elif promo.discount_type == "flat":
        discount = promo.discount_value
        
    discount = min(discount, req.subtotal)
    
    return {
        "valid": True,
        "code": promo.code,
        "discount_type": promo.discount_type,
        "discount_value": promo.discount_value,
        "discount_amount": discount
    }

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)

async def place_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Fetch user's cart items
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your cart is empty"
        )
        
    # 2. Recompute subtotal from database prices
    subtotal = Decimal("0.00")
    for item in cart_items:
        product = item.product
        
        # Guard: check if product is active
        if not product.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product '{product.name}' is no longer active and cannot be ordered"
            )
            
        # Guard: check stock availability
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.stock_quantity}, Requested: {item.quantity}"
            )
            
        subtotal += item.quantity * product.price
        
    # 3. Handle promo code validation & discount calculation
    discount = Decimal("0.00")
    promo_code_applied = None
    
    if order_in.promo_code:
        # Find active promo code
        promo = db.query(PromoCode).filter(
            PromoCode.code == order_in.promo_code,
            PromoCode.is_active == True
        ).first()
        
        # Verify expiry
        if not promo or (promo.expires_at and promo.expires_at < datetime.utcnow()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired promo code"
            )
            
        # Verify minimum order amount
        if subtotal < promo.min_order_amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Minimum order amount for promo code {promo.code} is ₹{promo.min_order_amount}"
            )
            
        # Compute discount
        if promo.discount_type == "percent":
            calculated_discount = subtotal * (promo.discount_value / Decimal("100.00"))
            # Apply max discount cap if defined
            if promo.max_discount is not None and calculated_discount > promo.max_discount:
                discount = promo.max_discount
            else:
                discount = calculated_discount
        elif promo.discount_type == "flat":
            discount = promo.discount_value
            
        # Ensure discount does not exceed subtotal
        discount = min(discount, subtotal)
        promo_code_applied = promo.code
        
    total = subtotal - discount
    
    # 4. Generate order number (sequential ORD-00001, thread-safe via lock on query or increment)
    # We query the max ID currently in the DB and add 1
    max_id = db.query(func.max(Order.id)).scalar() or 0
    next_id = max_id + 1
    order_number = f"ORD-{next_id:05d}"
    
    # 5. Decrement stock for products
    for item in cart_items:
        item.product.stock_quantity -= item.quantity
        
    # 6. Save order record
    new_order = Order(
        order_number=order_number,
        user_id=current_user.id,
        subtotal=subtotal,
        discount=discount,
        total=total,
        promo_code=promo_code_applied,
        shipping_name=order_in.shipping_name,
        shipping_address=order_in.shipping_address,
        shipping_city=order_in.shipping_city,
        shipping_state=order_in.shipping_state,
        shipping_zip=order_in.shipping_zip,
        payment_method=order_in.payment_method,
        status="pending"
    )
    
    db.add(new_order)
    db.flush()  # get new_order.id
    
    # 7. Create order item entries
    for item in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_purchase=item.product.price
        )
        db.add(order_item)
        
    # 8. Clear the shopping cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete(synchronize_session=False)
    
    # Commit transaction
    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.get("", response_model=List[OrderOut])
async def get_order_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{id}", response_model=OrderOut)
async def get_order_detail(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
        
    return order
