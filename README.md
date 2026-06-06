# ShopEasy - E-Commerce REST API & Frontend

A complete, production-ready, full-stack E-Commerce application. It features a robust Python/FastAPI backend API powered by SQLAlchemy and MySQL, and a beautiful, fully responsive frontend and Admin Dashboard built using Vanilla HTML, CSS, and JavaScript.

---

## Technical Architecture

### Backend API
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy (synchronous)
- **Database**: MySQL (using `pymysql` driver)
- **Authentication**: JWT (JSON Web Tokens - Access and Refresh token flow) via `python-jose`
- **Security**: Password hashing and verification using native `bcrypt` (independent of passlib for maximum compatibility)
- **Validation**: Pydantic v2
- **Documentation**: Automatically generated Swagger UI

### Frontend Applications
- **Technology Stack**: Vanilla HTML5, CSS3 (variables, flexbox, grid layouts, animations), and Vanilla JavaScript
- **Features**: Responsive design, token-based state management (stored in `localStorage`), custom toast notification library, modular navbar renderer, and API middleware.

---

## Directory Structure

```text
Ecommerce API/
├── ecommerce_api/          ← Backend application package
│   ├── main.py             ← FastAPI app, CORS middleware, and database seeding
│   ├── database.py         ← MySQL connection and SessionLocal session builder
│   ├── models.py           ← SQLAlchemy models (Users, Products, Cart, Orders, Reviews, Wishlists, Promos)
│   ├── schemas.py          ← Pydantic validation schemas
│   ├── routers/            ← Endpoint routes
│   │   ├── auth.py         ← Register, login, token refreshing
│   │   ├── products.py     ← Product searches, filters, categories
│   │   ├── cart.py         ← Cart CRUD operations
│   │   ├── orders.py       ← Checkout processing and order history
│   │   ├── reviews.py      ← Product reviews CRUD and aggregate score updates
│   │   ├── wishlist.py     ← Wishlist CRUD operations
│   │   └── admin.py        ← Analytics, CSV export, users directory, and admin management CRUD
│   └── utils/              ← Helper utilities
│       ├── auth.py         ← JWT token issuance and password checking
│       └── deps.py         ← FastAPI dependencies (User & Admin security context injectors)
│
├── frontend/               ← Customer Web Frontend
│   ├── index.html          ← Home Page with promo banners & featured items
│   ├── products.html       ← Product catalog with search, categorization, and sorting
│   ├── product.html        ← Detailed product page with specifications and customer reviews
│   ├── cart.html           ← Cart page with quantity controls and coupon verification
│   ├── checkout.html       ← Shipping address form and mock payment flow
│   ├── orders.html         ← User's personal order history list
│   ├── wishlist.html       ← Saved products list
│   ├── login.html          ← User/Admin sign-in form
│   ├── register.html       ← Customer registration form
│   ├── style.css           ← Core styling tokens, grids, responsiveness, and animations
│   ├── api.js              ← Base fetch API wrapper, authorization headers, and custom Toast UI
│   ├── navbar.js           ← Shared modular navbar component
│   │
│   └── admin/              ← Dedicated Admin Dashboard Workspace
│       ├── index.html      ← Overview metrics dashboard (orders, sales, stock, and low-stock alerts)
│       ├── products.html   ← Create, update, soft-delete, and stock management modal
│       ├── orders.html     ← Customer orders management, status changes, and CSV export
│       ├── users.html      ← Customer directory display list
│       ├── promos.html     ← Dynamic promo code creation and toggle controls
│       └── admin.css       ← Custom sidebar-centric dark theme stylesheet
│
├── .env                    ← Local secrets and MySQL configuration (ignored in Git)
├── .gitignore              ← Files excluded from Git version control
├── requirements.txt        ← Backend dependencies list
└── README.md               ← Project documentation
```

---

## Getting Started

### 1. Prerequisites
Ensure you have the following installed:
- Python 3.11+
- MySQL Server (running locally on port `3306`)

### 2. Setup Backend Server

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables:**
   A default `.env` file is located in the root directory:
   ```env
   DATABASE_URL=mysql+pymysql://root:root@localhost:3306/ecommerce_db
   SECRET_KEY=your_super_secret_key_change_this
   REFRESH_SECRET_KEY=your_refresh_secret_key_change_this
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   REFRESH_TOKEN_EXPIRE_DAYS=7
   ```
   *Note: Modify the `DATABASE_URL` credentials to match your local MySQL username, password, and port. On startup, the application will automatically create the `ecommerce_db` schema in your MySQL instance if it doesn't already exist.*

3. **Run the Development Server:**
   ```bash
   uvicorn ecommerce_api.main:app --reload
   ```
   - Swagger documentation is available at: **`http://127.0.0.1:8000/docs`**
   - The server will seed initial test accounts, catalog products, and promo codes automatically.

### 3. Setup Frontend Web Server

The frontend pages can be run using any local static web server. 

To run using Python's built-in HTTP server:
1. Open a new terminal in the project root.
2. Serve the `frontend` folder:
   ```bash
   cd frontend
   python -m http.server 5500
   ```
3. Open your browser and navigate to: **`http://127.0.0.1:5500`**

---

## Seed Accounts and Credentials

The database seeds initial user accounts and catalog values on its first start:

### Accounts
- **Administrator Login**
  - **Email**: `admin@shop.com`
  - **Password**: `admin123`
- **Customer Login**
  - **Email**: `user@shop.com`
  - **Password**: `user123`

### Promo Codes
- `WELCOME10` → 10% off (min order ₹500.00)
- `FLAT100` → Flat ₹100.00 off (min order ₹500.00)
- `SAVE20` → 20% off (min order ₹1000.00, discount capped at ₹500.00 maximum)

---

## API Routes Reference

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :---: | :--- |
| **AUTH** | | | |
| `POST` | `/api/auth/register` | Open | Create new customer account and return access+refresh token credentials |
| `POST` | `/api/auth/login` | Open | Authenticate credentials and return JWT tokens + user metadata |
| `POST` | `/api/auth/refresh` | Open | Request a refreshed access token using a valid refresh token |
| **PRODUCTS** | | | |
| `GET` | `/api/products` | Open | View catalog list with text search, categories, and price sorting filters |
| `GET` | `/api/products/{id}` | Open | View detailed active product catalog record including customer reviews |
| `GET` | `/api/products/categories` | Open | Retrieve unique categories listing |
| **CART** | | | |
| `GET` | `/api/cart` | User | Fetch active shopping cart list and overall price totals |
| `POST` | `/api/cart` | User | Add item to cart (increments quantities if item already exists) |
| `PUT` | `/api/cart/{item_id}` | User | Update quantity value for a specific cart row |
| `DELETE`| `/api/cart/{item_id}` | User | Remove a single catalog product entry from user cart |
| `DELETE`| `/api/cart` | User | Clear all items inside user cart |
| **ORDERS** | | | |
| `POST` | `/api/orders` | User | Place order. Deducts stock inventory, clears cart, and records details |
| `GET` | `/api/orders` | User | Retrieve list of past checkout orders for active user |
| `GET` | `/api/orders/{id}` | User | Fetch items and detailed info for a single order |
| **REVIEWS** | | | |
| `POST` | `/api/reviews` | User | Submit rating review (1 to 5 stars). Recalculates product metrics |
| `GET` | `/api/reviews/{product_id}` | Open | Fetch full customer reviews history for a specific product ID |
| `DELETE`| `/api/reviews/{id}` | User | Delete owned review and update product metrics |
| **WISHLIST** | | | |
| `GET` | `/api/wishlist` | User | Retrieve current user's saved wishlist catalog items |
| `POST` | `/api/wishlist` | User | Add a specific catalog product to personal wishlist |
| `DELETE`| `/api/wishlist/{product_id}` | User | Remove item from user's wishlist |
| **ADMIN** | | | |
| `GET` | `/api/admin/products` | Admin | Get all catalog products including soft-deleted/inactive ones |
| `POST` | `/api/admin/products` | Admin | Insert a new product catalog record |
| `PUT` | `/api/admin/products/{id}` | Admin | Edit details of a product record |
| `DELETE`| `/api/admin/products/{id}` | Admin | Soft-delete a product record (toggles `is_active` to false) |
| `GET` | `/api/admin/orders` | Admin | View a system-wide order ledger. Supports order status filters |
| `PUT` | `/api/admin/orders/{id}/status` | Admin | Update status parameter on a customer order |
| `GET` | `/api/admin/users` | Admin | Access the user accounts roster directory |
| `GET` | `/api/admin/dashboard` | Admin | Fetch revenue aggregate, order volumes, user signup count, and low stock lists |
| `GET` | `/api/admin/orders/export` | Admin | Export the entire orders log database to a CSV download attachment |
| `POST` | `/api/api/admin/promo` | Admin | Insert new promotion code rules |
| `GET` | `/api/admin/promo` | Admin | Fetch system-wide list of active & inactive promo codes |
| `PUT` | `/api/admin/promo/{id}` | Admin | Toggle promo code status (active vs inactive) |
