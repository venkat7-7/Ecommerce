# E-Commerce REST API

A complete, production-ready REST API for an e-commerce platform built with FastAPI, SQLAlchemy, and MySQL.

## Tech Stack
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy (synchronous)
- **Database**: MySQL (using `pymysql` driver)
- **Authentication**: JWT (JSON Web Tokens - Access and Refresh token flow) via `python-jose`
- **Security**: Password hashing using `bcrypt`
- **Validation**: Pydantic v2
- **Documentation**: Automatically generated Swagger UI

---

## Directory Structure

```text
ecommerce_api/
├── main.py              ← FastAPI app, configuration, and startup seeds
├── database.py          ← Database connection settings and SessionLocal setup
├── models.py            ← SQLAlchemy DB models
├── schemas.py           ← Pydantic validation & response schemas
├── routers/             ← Feature-grouped controllers/routers
│   ├── auth.py          ← Register, Login, Token Refresh
│   ├── products.py      ← Catalog searching, filtering, and categories
│   ├── cart.py          ← Add, update quantities, remove, clear items
│   ├── orders.py        ← Place checkout orders, order histories
│   ├── reviews.py       ← Review submissions & listings
│   ├── wishlist.py      ← Wishlist CRUD
│   └── admin.py         ← Administration dashboards, analytics, CSV exports, products/promo codes CRUD
└── utils/
    ├── auth.py          ← Password hashing & JWT operations
    └── deps.py          ← Shared FastAPI dependencies (authentication, authorization)
```

---

## Getting Started

### 1. Prerequisites
Ensure you have Python 3.11+ and MySQL server running.

### 2. Installation
Clone or navigate to the project directory and install the requirements:
```bash
pip install -r requirements.txt
```

### 3. Setup Configuration
A default configuration is set up in `.env` at the root directory:
```env
DATABASE_URL=mysql+pymysql://root:root@localhost:3306/ecommerce_db
SECRET_KEY=your_super_secret_key_change_this
REFRESH_SECRET_KEY=your_refresh_secret_key_change_this
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```
*Note: Make sure your MySQL username, password, and port match your local settings. On startup, the application will automatically create the database `ecommerce_db` if it does not already exist.*

### 4. Running the Server
Run the FastAPI development server from the root directory:
```bash
uvicorn ecommerce_api.main:app --reload
```
Once started:
- Access the API documentation at: **`http://127.0.0.1:8000/docs`** (Swagger UI)
- The app will automatically run schema migrations and seed the initial database configuration.

---

## Default Seed Credentials

Upon the first startup, the database is automatically populated with the following resources:

### Test Accounts
- **Administrator Role**
  - **Email**: `admin@shop.com`
  - **Password**: `admin123`
- **Customer Role**
  - **Email**: `user@shop.com`
  - **Password**: `user123`

### Seeded Catalog Products
- **Electronics**: Wireless Headphones (₹1999.00), Mechanical Keyboard (₹3499.00)
- **Clothing**: Cotton T-Shirt (₹499.00), Denim Jacket (₹1799.00)
- **Grocery**: Organic Honey 500g (₹349.00)

### Seeded Promo Codes
- `WELCOME10` → 10% off (min order ₹500.00)
- `FLAT100` → ₹100.00 flat discount (min order ₹500.00)
- `SAVE20` → 20% off (min order ₹1000.00, capped at a maximum of ₹500.00 discount)

---

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| **AUTH** | | | |
| `POST` | `/api/auth/register` | None | Register a new user account. Returns user info + access & refresh token. |
| `POST` | `/api/auth/login` | None | Login with email & password. Returns access token, refresh token, and user role. |
| `POST` | `/api/auth/refresh` | None | Request a new access token using a valid refresh token. |
| **PRODUCTS** | | | |
| `GET` | `/api/products` | None | List active products. Supports sorting, searching, and filter query parameters. |
| `GET` | `/api/products/{id}` | None | View details of a specific active product including ratings. |
| `GET` | `/api/products/categories` | None | Get a list of all unique active categories. |
| **CART** | | | |
| `GET` | `/api/cart` | User | View current user's active cart along with total price calculation. |
| `POST` | `/api/cart` | User | Add an item to cart (merges quantity if the product is already in the cart). |
| `PUT` | `/api/cart/{item_id}` | User | Update quantity of a product in the cart. |
| `DELETE`| `/api/cart/{item_id}` | User | Remove a specific cart item. |
| `DELETE`| `/api/cart` | User | Clear all items from user's shopping cart. |
| **ORDERS** | | | |
| `POST` | `/api/orders` | User | Place an order. Empties the cart, decrements product stock, validates promo codes. |
| `GET` | `/api/orders` | User | List all order history for the active user (newest first). |
| `GET` | `/api/orders/{id}` | User | Get details of a specific order. |
| **REVIEWS** | | | |
| `POST` | `/api/reviews` | User | Write a review (ratings 1-5). Dynamically recalculates product rating statistics. |
| `GET` | `/api/reviews/{product_id}` | None | Retrieve all customer reviews for a specific product. |
| `DELETE`| `/api/reviews/{id}` | User | Delete own product review. Recalculates product rating aggregates. |
| **WISHLIST** | | | |
| `GET` | `/api/wishlist` | User | View all items in the user's wishlist. |
| `POST` | `/api/wishlist` | User | Add a product to the user's wishlist. |
| `DELETE`| `/api/wishlist/{product_id}` | User | Remove a product from the wishlist. |
| **ADMIN** | | | |
| `GET` | `/api/admin/products` | Admin | List all products (includes inactive). |
| `POST` | `/api/admin/products` | Admin | Create/Add a new product. |
| `PUT` | `/api/admin/products/{id}` | Admin | Edit details of a specific product. |
| `DELETE`| `/api/admin/products/{id}` | Admin | Soft-delete a product (sets `is_active` to `False`). |
| `GET` | `/api/admin/orders` | Admin | List all user orders. Supports `?status=` parameter filtering. |
| `PUT` | `/api/admin/orders/{id}/status` | Admin | Update status of an order (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`). |
| `GET` | `/api/admin/users` | Admin | View a directory of all registered users. |
| `GET` | `/api/admin/dashboard` | Admin | Fetch system analytics (total users, products, orders, low-stock items, total revenue). |
| `GET` | `/api/admin/orders/export` | Admin | Download all orders list as a CSV file. |
| `POST` | `/api/admin/promo` | Admin | Create a new promotion code. |
| `GET` | `/api/admin/promo` | Admin | List all existing promo codes. |
| `PUT` | `/api/admin/promo/{id}` | Admin | Toggle a promo code active/inactive state. |
