from datetime import datetime
from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

# -------------------------------------------------------------
# USER SCHEMAS
# -------------------------------------------------------------
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserRegister(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -------------------------------------------------------------
# TOKEN SCHEMAS
# -------------------------------------------------------------
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str

class TokenRefresh(BaseModel):
    refresh_token: str

class TokenRefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RegisterResponse(BaseModel):
    user: UserOut
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# -------------------------------------------------------------
# PRODUCT SCHEMAS
# -------------------------------------------------------------
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    category: str
    image_url: Optional[str] = None
    stock_quantity: int = Field(..., ge=0)
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    category: Optional[str] = None
    image_url: Optional[str] = None
    stock_quantity: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

class ProductOut(ProductBase):
    id: int
    avg_rating: float
    review_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# -------------------------------------------------------------
# CART SCHEMAS
# -------------------------------------------------------------
class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0, description="Quantity must be greater than 0")

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0, description="Quantity must be greater than 0")

class CartItemOut(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    added_at: datetime
    product: ProductOut

    model_config = ConfigDict(from_attributes=True)

class CartOut(BaseModel):
    items: List[CartItemOut]
    total: Decimal

    model_config = ConfigDict(from_attributes=True)

# -------------------------------------------------------------
# ORDER SCHEMAS
# -------------------------------------------------------------
class OrderCreate(BaseModel):
    shipping_name: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_zip: str
    payment_method: str = Field(..., description="e.g. Credit Card, UPI, COD, Net Banking")
    promo_code: Optional[str] = None

    @field_validator("promo_code")
    @classmethod
    def uppercase_promo_code(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return v.strip().upper()
        return v

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price_at_purchase: Decimal
    product: ProductOut

    model_config = ConfigDict(from_attributes=True)

class OrderOut(BaseModel):
    id: int
    order_number: str
    user_id: int
    subtotal: Decimal
    discount: Decimal
    total: Decimal
    promo_code: Optional[str] = None
    shipping_name: str
    shipping_address: str
    shipping_city: str
    shipping_state: str
    shipping_zip: str
    payment_method: str
    status: str
    created_at: datetime
    items: List[OrderItemOut]
    user: UserOut

    model_config = ConfigDict(from_attributes=True)

class OrderStatusUpdate(BaseModel):
    status: str = Field(..., description="Must be one of pending, confirmed, shipped, delivered, cancelled")

# -------------------------------------------------------------
# REVIEW SCHEMAS
# -------------------------------------------------------------
class ReviewCreate(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5, description="Rating must be between 1 and 5")
    comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    user: UserOut

    model_config = ConfigDict(from_attributes=True)

# -------------------------------------------------------------
# WISHLIST SCHEMAS
# -------------------------------------------------------------
class WishlistAdd(BaseModel):
    product_id: int

class WishlistOut(BaseModel):
    id: int
    user_id: int
    product_id: int
    added_at: datetime
    product: ProductOut

    model_config = ConfigDict(from_attributes=True)

# -------------------------------------------------------------
# PROMO CODE SCHEMAS
# -------------------------------------------------------------
class PromoCodeCreate(BaseModel):
    code: str = Field(..., description="Promo code text")
    discount_type: str = Field(..., description="percent or flat")
    discount_value: Decimal = Field(..., gt=0)
    min_order_amount: Decimal = Field(default=Decimal(0.0), ge=0)
    max_discount: Optional[Decimal] = Field(None, gt=0)
    is_active: bool = True
    expires_at: Optional[datetime] = None

    @field_validator("code")
    @classmethod
    def force_uppercase_code(cls, v: str) -> str:
        return v.strip().upper()

    @field_validator("discount_type")
    @classmethod
    def validate_discount_type(cls, v: str) -> str:
        val = v.strip().lower()
        if val not in ("percent", "flat"):
            raise ValueError("discount_type must be either 'percent' or 'flat'")
        return val

class PromoCodeOut(BaseModel):
    id: int
    code: str
    discount_type: str
    discount_value: Decimal
    min_order_amount: Decimal
    max_discount: Optional[Decimal]
    is_active: bool
    expires_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

class PromoCodeStatusUpdate(BaseModel):
    is_active: bool

# -------------------------------------------------------------
# ADMIN DASHBOARD SCHEMAS
# -------------------------------------------------------------
class DashboardOut(BaseModel):
    total_orders: int
    total_revenue: Decimal
    total_users: int
    total_products: int
    low_stock_products: List[ProductOut]

    model_config = ConfigDict(from_attributes=True)
