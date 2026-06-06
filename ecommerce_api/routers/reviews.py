from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Review, Product, User
from ..schemas import ReviewCreate, ReviewOut
from ..utils.deps import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])

def recalculate_product_ratings(product_id: int, db: Session):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return
        
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    count = len(reviews)
    if count == 0:
        product.avg_rating = 0.0
        product.review_count = 0
    else:
        avg = sum(r.rating for r in reviews) / count
        product.avg_rating = round(avg, 2)
        product.review_count = count
        
    db.commit()

@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def add_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if product exists and is active
    product = db.query(Product).filter(Product.id == review_in.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
        
    # Check if user has already reviewed this product (one review per user per product)
    existing_review = db.query(Review).filter(
        Review.user_id == current_user.id,
        Review.product_id == review_in.product_id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already reviewed this product. You can delete your existing review to submit a new one."
        )
        
    new_review = Review(
        user_id=current_user.id,
        product_id=review_in.product_id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    # Recalculate average rating and review count
    recalculate_product_ratings(review_in.product_id, db)
    
    # Reload with relationships populated
    db.refresh(new_review)
    return new_review

@router.get("/{product_id}", response_model=List[ReviewOut])
async def get_product_reviews(
    product_id: int,
    db: Session = Depends(get_db)
):
    # Verify product exists
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
        
    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(Review.created_at.desc()).all()
    return reviews

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    review = db.query(Review).filter(Review.id == id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
        
    # User can only delete their own reviews
    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own reviews"
        )
        
    product_id = review.product_id
    db.delete(review)
    db.commit()
    
    # Recalculate average rating and review count
    recalculate_product_ratings(product_id, db)
    return None
