# ShopEasy — E-Commerce Platform

A production-ready, full-stack E-Commerce application. It features a robust Python/FastAPI backend API powered by SQLAlchemy and PostgreSQL, async task processing via Celery & Redis, database migrations with Alembic, and two distinct frontend client options (a classic Vanilla HTML/CSS/JS frontend and a modern React 19 + Vite + Tailwind CSS v4 frontend).

---

## Technical Architecture

### ⚡ Backend API
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL (using `psycopg2-binary` driver)
- **Task Queue**: Celery (with Redis broker & result backend)
- **Authentication**: JWT (JSON Web Tokens - Access and Refresh token flow) via `python-jose`
- **Security**: Password hashing and verification using native `bcrypt` (independent of passlib for maximum compatibility)
- **Validation**: Pydantic v2
- **Database Migrations**: Alembic
- **Documentation**: Automatically generated Swagger UI

### 🖥️ Client Applications
This project includes two alternative frontends. You can run either or both depending on your testing needs:

#### 1. React Frontend (`frontend-react/`)
- **Technology Stack**: React 19, Vite, Tailwind CSS v4 (with `@tailwindcss/vite`), React Router v7, and Lucide React Icons
- **Key Features**:
  - **Dark Mode**: High-fidelity theme toggling with theme persistence using `localStorage`.
  - **Dynamic Navbar & Footer**: Navigation that updates reactively based on authentication state (Admin vs. Customer).
  - **E-Commerce Catalog**: Text search, multi-category filters, price sorting, and dynamic product cards.
  - **Interactive Chatbot**: AI customer support assistant anchored to the application window.
  - **Admin Dashboard**: Full metrics visualization (orders, sales, stock, and low-stock alerts) along with inline inventory and promo management.
  - **Animations**: Fluid page load and scrolling animations using a custom `ScrollReveal` component.

#### 2. Classic Frontend (`frontend/`)
- **Technology Stack**: Vanilla HTML5, CSS3 (variables, flexbox, grid layouts, animations), and Vanilla JavaScript
- **Key Features**: Responsive grid layout, token-based state management (stored in `localStorage`), custom toast notification library, modular navbar renderer, and API middleware.

---

## Directory Structure

```text
Ecommerce API/
├── alembic/                ← Database migration versions and environment configurations
├── alembic.ini             ← Alembic CLI setup file
├── docker-compose.yml      ← Multi-container service definitions (web, worker, db, redis)
├── Dockerfile              ← Docker instruction container for backend API & worker
├── requirements.txt        ← Backend dependencies list
├── .env                    ← Environment variables (ignored in Git)
│
├── ecommerce_api/          ← Backend application package
│   ├── main.py             ← FastAPI app instance, CORS middleware, and database seeding
│   ├── database.py         ← PostgreSQL connection and SessionLocal session builder
│   ├── models.py           ← SQLAlchemy models (Users, Products, Cart, Orders, Reviews, Wishlists, Promos)
│   ├── schemas.py          ← Pydantic validation schemas
│   ├── celery_app.py       ← Celery queue configuration
│   ├── tasks.py            ← Celery tasks (e.g. sending order confirmation emails)
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
├── frontend-react/         ← Modern React Frontend Application
│   ├── src/
│   │   ├── components/     ← Navbar, Footer, Chatbot, ProductCard, ScrollReveal
│   │   ├── pages/          ← Home, Catalog, ProductDetail, Cart, Wishlist, Orders, Login, Register, AdminDashboard
│   │   ├── App.jsx         ← Main React app & router configuration
│   │   ├── index.css       ← Custom styles and Tailwind v4 directives
│   │   └── api.js          ← API fetch wrapper and toast notifications
│   ├── vite.config.js      ← Vite configuration (including API local development proxy)
│   ├── package.json        ← Frontend npm script and dependencies configuration
│   └── README.md           ← React-specific documentation
│
└── frontend/               ← Classic Vanilla JS Frontend
    ├── index.html          ← Home Page with promo banners & featured items
    ├── style.css           ← Core styling tokens, grids, responsiveness, and animations
    ├── api.js              ← Base fetch API wrapper, authorization headers, and custom Toast UI
    ├── navbar.js           ← Shared modular navbar component
    └── admin/              ← Dedicated Admin Dashboard Workspace
```

---

## Getting Started

### Method 1: Running via Docker Compose (Recommended)

Docker Compose starts the backend server, database, Redis broker, and Celery worker.

1. Ensure you have **Docker** and **Docker Compose** installed.
2. In the root directory, build and run the services:
   ```bash
   docker-compose up --build
   ```
3. Once running:
   - The Backend API will be available at: **`http://127.0.0.1:8000`**
   - Swagger documentation is available at: **`http://127.0.0.1:8000/docs`**
   - Celery and Redis will handle tasks in the background.

---

### Method 2: Manual Local Setup

#### 1. Prerequisites
- Python 3.11+ installed
- Node.js & npm installed (for React frontend)
- PostgreSQL Server running locally on port `5432`
- Redis Server running locally on port `6379` (needed for Celery background tasks)

#### 2. Configure Environment Variables
Create a `.env` file in the root directory (a reference is provided below):
```env
DATABASE_URL=postgresql+psycopg2://postgres:root@localhost:5432/ecommerce_db
SECRET_KEY=your_super_secret_key_change_this
REFRESH_SECRET_KEY=your_refresh_secret_key_change_this
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

GEMINI_API_KEY=your_gemini_api_key_here

# Optional SMTP Configuration (if missing, Celery will log emails to the logs/ directory)
SMTP_SERVER=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
SENDER_EMAIL=noreply@ecommerce.com
```
*Note: Adjust connection credentials in `DATABASE_URL` to match your local PostgreSQL server. The application will automatically attempt to create the database schema `ecommerce_db` if it does not exist.*

#### 3. Setup and Start Backend Server
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Apply Database Migrations:**
   ```bash
   alembic upgrade head
   ```
3. **Run the Development Server:**
   ```bash
   uvicorn ecommerce_api.main:app --reload
   ```
   - Swagger Docs: **`http://127.0.0.1:8000/docs`**
   - The application automatically seeds initial mock accounts, products, and promo codes on startup.

#### 4. Run Celery Worker (Optional)
If you want to process background tasks (such as sending order confirmation emails):
1. Ensure your Redis server is running.
2. In a separate terminal run the worker:
   ```bash
   celery -A ecommerce_api.celery_app.celery_app worker --loglevel=info
   ```
   *For Windows users running Celery, you may need to install eventlet (`pip install eventlet`) and start the worker with:*
   ```bash
   celery -A ecommerce_api.celery_app.celery_app worker --loglevel=info -P eventlet
   ```

#### 5. Run the React Frontend
1. Navigate to the `frontend-react` folder:
   ```bash
   cd frontend-react
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to: **`http://localhost:5173`** (Requests to `/api/*` are proxied to `http://127.0.0.1:8000` automatically).

#### 6. Run the Classic Frontend
If you prefer running the Vanilla frontend:
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start a static local server (e.g. using Python):
   ```bash
   python -m http.server 5500
   ```
3. Open your browser to: **`http://127.0.0.1:5500`**

---

## Alembic Migration Commands

Alembic handles database migrations. Use the following commands:
- **Create a new migration after model changes:**
  ```bash
  alembic revision --autogenerate -m "description of changes"
  ```
- **Apply migrations to the database:**
  ```bash
  alembic upgrade head
  ```
- **Revert the last migration:**
  ```bash
  alembic downgrade -1
  ```

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
| `POST` | `/api/admin/promo` | Admin | Insert new promotion code rules |
| `GET` | `/api/admin/promo` | Admin | Fetch system-wide list of active & inactive promo codes |
| `PUT` | `/api/admin/promo/{id}` | Admin | Toggle promo code status (active vs inactive) |
