from decimal import Decimal
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import User, Product, PromoCode
from .utils.auth import get_password_hash
from .routers import auth, products, cart, orders, reviews, wishlist, admin

app = FastAPI(
    title="E-Commerce REST API",
    description="A complete, production-ready REST API for an E-Commerce platform built with FastAPI.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers under the "/api" prefix
app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(wishlist.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

# Database initialization and seeding on startup
@app.on_event("startup")
def on_startup():
    # 1. Create tables
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed default data
    db = SessionLocal()
    try:
        # A. Seed Users
        admin_email = "admin@shop.com"
        if not db.query(User).filter(User.email == admin_email).first():
            admin_user = User(
                email=admin_email,
                full_name="Shop Admin",
                password_hash=get_password_hash("admin123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            
        regular_email = "user@shop.com"
        if not db.query(User).filter(User.email == regular_email).first():
            regular_user = User(
                email=regular_email,
                full_name="Regular User",
                password_hash=get_password_hash("user123"),
                role="user",
                is_active=True
            )
            db.add(regular_user)
            
        # B. Seed Products (if table is empty)
        if db.query(Product).count() == 0:
            sample_products = [
                Product(
                    name="Wireless Headphones",
                    description="Premium wireless noise-canceling headphones with 40h battery life.",
                    price=Decimal("1999.00"),
                    category="Electronics",
                    image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
                    stock_quantity=50,
                    is_active=True
                ),
                Product(
                    name="Mechanical Keyboard",
                    description="RGB tactile mechanical gaming keyboard with custom switches.",
                    price=Decimal("3499.00"),
                    category="Electronics",
                    image_url="https://images.unsplash.com/photo-1587829741301-dc798b83add3",
                    stock_quantity=30,
                    is_active=True
                ),
                Product(
                    name="Cotton T-Shirt",
                    description="100% premium organic cotton t-shirt. Breathable and comfortable.",
                    price=Decimal("499.00"),
                    category="Clothing",
                    image_url="https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
                    stock_quantity=100,
                    is_active=True
                ),
                Product(
                    name="Denim Jacket",
                    description="Classic blue denim jacket with double front pockets and durable build.",
                    price=Decimal("1799.00"),
                    category="Clothing",
                    image_url="https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
                    stock_quantity=20,
                    is_active=True
                ),
                Product(
                    name="Organic Honey 500g",
                    description="Pure, natural raw organic forest honey.",
                    price=Decimal("349.00"),
                    category="Grocery",
                    image_url="https://images.unsplash.com/photo-1587049352846-4a222e784d38",
                    stock_quantity=15,
                    is_active=True
                )
            ]
            db.add_all(sample_products)
            
        # C. Seed Promo Codes (if table is empty)
        if db.query(PromoCode).count() == 0:
            sample_promos = [
                PromoCode(
                    code="WELCOME10",
                    discount_type="percent",
                    discount_value=Decimal("10.00"),
                    min_order_amount=Decimal("500.00"),
                    max_discount=None,
                    is_active=True,
                    expires_at=datetime.utcnow() + timedelta(days=365)
                ),
                PromoCode(
                    code="FLAT100",
                    discount_type="flat",
                    discount_value=Decimal("100.00"),
                    min_order_amount=Decimal("500.00"),
                    max_discount=None,
                    is_active=True,
                    expires_at=datetime.utcnow() + timedelta(days=365)
                ),
                PromoCode(
                    code="SAVE20",
                    discount_type="percent",
                    discount_value=Decimal("20.00"),
                    min_order_amount=Decimal("1000.00"),
                    max_discount=Decimal("500.00"),
                    is_active=True,
                    expires_at=datetime.utcnow() + timedelta(days=365)
                )
            ]
            db.add_all(sample_promos)
            
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error during startup seeding: {e}")
    finally:
        db.close()

@app.get("/")
async def root():
    return {
        "message": "Welcome to the E-Commerce REST API. Please visit /docs for API documentation."
    }
