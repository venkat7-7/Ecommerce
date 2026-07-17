import os
import requests
from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import Product, Order, PromoCode
from ..utils.deps import get_optional_current_user
from ..utils.embeddings import get_embedding, cosine_similarity

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatMessage(BaseModel):
    role: str  # "user" or "model" (Google Gemini role terminology)
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

@router.post("")
async def support_chat(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_optional_current_user)
):
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    
    # 1. Graceful offline check
    if not GEMINI_API_KEY:
        return {
            "response": "🔌 **Offline Mode**: Hello! I'm the ShopEasy Support Assistant. "
                        "I am currently offline because the `GEMINI_API_KEY` is not set in the server's `.env` configuration. "
                        "Please configure it to activate me!"
        }

    # 2. VECTOR RAG RETRIEVAL: Find top 3 relevant products
    query_vector = get_embedding(req.message)
    retrieved_products_text = ""
    
    if query_vector:
        # Load active products with embeddings
        products = db.query(Product).filter(Product.is_active == True).all()
        scored_products = []
        for p in products:
            score = cosine_similarity(query_vector, p.embedding) if p.embedding else 0.0
            scored_products.append((p, score))
        
        # Sort descending by similarity score
        scored_products.sort(key=lambda x: x[1], reverse=True)
        top_products = scored_products[:3]
        
        # Format retrieval context
        retrieved_products_text = "\n### Retrieved Relevant Products:\n"
        for p, score in top_products:
            # We only count items as matches if they have a non-zero similarity
            if score > 0.1: 
                retrieved_products_text += (
                    f"- **{p.name}** (ID: {p.id}, Category: {p.category}) "
                    f"Price: INR {p.price:.2f}, Stock left: {p.stock_quantity}, "
                    f"Rating: {p.avg_rating:.1f}/5. Description: {p.description or 'N/A'}\n"
                )
    
    # 3. CONTEXT GATHERING: Promo Codes
    promos = db.query(PromoCode).filter(PromoCode.is_active == True).all()
    promo_context = "\n### Active Promo Codes & Discounts:\n"
    if promos:
        for pr in promos:
            promo_context += f"- Code `{pr.code}`: {pr.discount_value} {pr.discount_type} discount (Min spend: INR {pr.min_order_amount:.2f})\n"
    else:
        promo_context += "- No promo codes currently active.\n"

    # 4. CONTEXT GATHERING: User Account & Orders
    user_context = ""
    if current_user:
        orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
        user_context = (
            f"\n### Authenticated User:\n"
            f"- Name: {current_user.full_name}\n"
            f"- Email: {current_user.email}\n"
            f"- Account Role: {current_user.role}\n"
            f"\n### User Order History:\n"
        )
        if orders:
            for o in orders:
                user_context += (
                    f"- Order Number: `{o.order_number}` (Total: INR {o.total:.2f}, "
                    f"Status: {o.status.upper()}, Date: {o.created_at.strftime('%Y-%m-%d')}, "
                    f"Shipping Address: {o.shipping_address}, {o.shipping_city}, {o.shipping_state} {o.shipping_zip})\n"
                )
        else:
            user_context += "- The user has not placed any orders yet.\n"
    else:
        user_context = "\n### Authenticated User:\n- None (Guest Session)\n"

    # 5. SYSTEM PROMPT DESIGN
    system_instruction = (
        "You are the ShopEasy AI Support Assistant, a friendly and professional chatbot representing "
        "the ShopEasy e-commerce store. Your goal is to help users with their questions about products, "
        "promotions, order status, and checkout policies.\n\n"
        "GUIDELINES:\n"
        "1. Answer questions based on the retrieved product database context, coupons, and orders below.\n"
        "2. If a user asks about general topics (e.g., return policies, delivery times), answer professionally. "
        "Returns are accepted within 30 days of purchase.\n"
        "3. If a user asks about their account or orders, reference the Authenticated User section. "
        "If they are not authenticated (Guest Session), politely ask them to log in to see order histories.\n"
        "4. Keep answers concise, accurate, and easy to read. Use bullet points and Markdown formatting.\n\n"
        "---"
        f"{user_context}"
        f"{retrieved_products_text}"
        f"{promo_context}"
    )

    # 6. CONVERSATION HISTORY SYNCHRONIZATION
    contents_payload = []
    for h in req.history:
        contents_payload.append({
            "role": "user" if h.role == "user" else "model",
            "parts": [{"text": h.content}]
        })
    # Append the current query
    contents_payload.append({
        "role": "user",
        "parts": [{"text": req.message}]
    })

    # 7. CALL GEMINI API
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": contents_payload,
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        }
    }

    try:
        res = requests.post(url, json=payload, timeout=15)
        if res.status_code == 200:
            res_data = res.json()
            reply = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return {"response": reply}
        else:
            return {"response": f"⚠️ **Error**: Failed to communicate with the Gemini API (Status {res.status_code})."}
    except Exception as e:
        return {"response": f"⚠️ **Connection Error**: Failed to contact the AI assistant: {str(e)}"}

