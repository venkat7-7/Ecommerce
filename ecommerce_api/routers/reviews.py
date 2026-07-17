import os
import requests
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

@router.get("/{product_id}/summary")
async def get_product_reviews_summary(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieves all product reviews and asks OpenAI to compile a bulleted sentiment summary.
    """
    # Verify product exists
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
        
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    if not reviews:
        return {"summary": "No reviews available yet for this product."}

    # Filter out empty comments
    comments = [f"- {r.rating} stars: {r.comment}" for r in reviews if r.comment and r.comment.strip()]
    if not comments:
        return {"summary": f"This product has {len(reviews)} numerical rating(s), but no written reviews to summarize yet."}

    # 1. Graceful offline check if key is not configured
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        return {
            "summary": "🔌 **AI Summary Unavailable**: Set `GEMINI_API_KEY` in your `.env` configuration file to activate AI review summarization."
        }

    # Compile comments
    reviews_text = "\n".join(comments)

    system_instruction = (
        "You are an AI Product Review Summarizer representing ShopEasy. Analyze the customer reviews "
        "provided for the product and write a concise, bulleted summary in Markdown format.\n\n"
        "Your summary must include:\n"
        "1. Overall Sentiment: A 1-2 sentence overview of customer satisfaction.\n"
        "2. **Pros**: Highlights/strengths (e.g., sound quality, battery life, design).\n"
        "3. **Cons**: Weaknesses/complaints (e.g., price, weight, tight fit, delivery speed).\n\n"
        "Keep the output clear, highly readable, and under 150 words. Do not fabricate reviews or details."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"Here are the customer reviews for '{product.name}':\n\n{reviews_text}"}]
            }
        ],
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        }
    }

    try:
        res = requests.post(url, json=payload, timeout=15)
        if res.status_code == 200:
            res_data = res.json()
            reply = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return {"summary": reply}
        else:
            return {"summary": f"⚠️ **Error**: Failed to generate summary from AI service (Status {res.status_code})."}
    except Exception as e:
        return {"summary": f"⚠️ **Connection Error**: Failed to reach summarizer service: {str(e)}"}
