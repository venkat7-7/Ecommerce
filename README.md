# 🛒 ShopEasy — Enterprise E-Commerce Platform & AI Assistant

<div align="center">

  ![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
  ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
  ![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white)
  ![Celery](https://img.shields.io/badge/Celery-Async-37B24D?style=for-the-badge&logo=celery&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)
  ![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E44AD?style=for-the-badge&logo=google&logoColor=white)

  **A production-ready, full-stack E-Commerce ecosystem featuring an asynchronous FastAPI REST API, PostgreSQL database with Alembic migrations, Celery task queue, dual frontends (React 19 & Vanilla JS), and an integrated AI Customer Support Chatbot powered by Vector RAG and Google Gemini 2.5 Flash.**

</div>

---

## 📌 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🏗️ System Architecture Diagram](#️-system-architecture-diagram)
- [📂 Directory Structure](#-directory-structure)
- [🚀 Quick Start](#-quick-start)
  - [Option 1: Docker Compose (Recommended)](#option-1-docker-compose-recommended)
  - [Option 2: Manual Local Setup](#option-2-manual-local-setup)
- [🔑 Pre-configured Test Credentials](#-pre-configured-test-credentials)
- [⚙️ Environment Variables](#️-environment-variables)
- [📡 Complete API Route Reference](#-complete-api-route-reference)
- [🗄️ Database Migrations (Alembic)](#️-database-migrations-alembic)
- [🤖 AI Support Chatbot Architecture](#-ai-support-chatbot-architecture)
- [🔍 Troubleshooting & FAQ](#-troubleshooting--faq)
- [📜 License](#-license)

---

## ✨ Key Features

### ⚡ Backend & Core API (`FastAPI` + `PostgreSQL`)
- **Secure Authentication Flow**: Full JSON Web Token (JWT) lifecycle with separate Access and Refresh token rotation, bcrypt password hashing, and role-based access control (Admin vs. Customer).
- **Asynchronous Task Processing**: Integrated **Celery & Redis** for background operations (order status notifications, email delivery via SMTP or fallback logging).
- **Database Architecture**: SQLAlchemy 2.0 ORM backed by PostgreSQL, featuring automatic table creation, initial data seeding (products, users, promos), and versioned **Alembic migrations**.
- **Robust Admin Metrics**: Real-time sales aggregation, active user statistics, low-stock inventory alerts, and instant **CSV export** for system orders.

### 🤖 AI Customer Support Chatbot (`Vector RAG` + `Gemini 2.5 Flash`)
- **Vector Retrieval-Augmented Generation (RAG)**: Uses text embedding similarity matching to retrieve relevant products live from the database.
- **Dynamic Context Injection**: Passes authenticated user profile, recent order history, active promotional codes, and catalog items to Google Gemini 2.5 Flash.
- **Graceful Fallback Mode**: Displays an informative offline message if the `GEMINI_API_KEY` is not present in `.env`.

### 🖥️ Dual Client Applications
1. **React 19 Frontend (`frontend-react/`)**:
   - Built with **React 19**, **Vite**, **Tailwind CSS v4**, and **React Router v7**.
   - Custom high-fidelity **Dark Mode toggle** with persistent state.
   - Dynamic interactive search bar, category multi-filters, price sorting, product ratings, cart badge counters, and wishlist toggles.
   - Comprehensive **Admin Dashboard** with interactive metric charts, stock updates, promo code manager, and order status lifecycle updates.
   - Smooth entrance micro-animations powered by custom `ScrollReveal` wrappers.
2. **Classic Frontend (`frontend/`)**:
   - Built with pure Vanilla HTML5, CSS3, and JavaScript (ES6+).
   - Modular navigation renderer, token middleware, and custom Toast notification popups.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology / Library | Description |
| :--- | :--- | :--- |
| **Backend Framework** | [FastAPI](https://fastapi.tiangolo.com/) | High-performance Python async web framework with automatic OpenAPI docs |
| **Database** | [PostgreSQL 15](https://www.postgresql.org/) + [SQLAlchemy](https://www.sqlalchemy.org/) | Relational database storage with ORM abstractions |
| **Migrations** | [Alembic](https://alembic.sqlalchemy.org/) | Database schema migration control |
| **Task Queue** | [Celery](https://docs.celeryq.dev/) + [Redis 7](https://redis.io/) | Asynchronous worker processing for background tasks |
| **Security & Auth** | `python-jose`, native `bcrypt`, `Pydantic v2` | JWT access/refresh security & request validation |
| **AI / RAG Engine** | [Google Gemini 2.5 Flash API](https://ai.google.dev/) | Conversational AI support assistant with vector similarity retrieval |
| **React Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons | Modern, ultra-fast SPA client |
| **Vanilla Frontend** | HTML5, CSS3 Variables/Grid, Vanilla JS | Lightweight static web client |
| **Containerization** | [Docker](https://www.docker.com/) & Docker Compose | Multi-container environment orchestration |

---

## 🏗️ System Architecture Diagram

```mermaid
flowchart TD
    subgraph Clients["🖥️ User Interface Layer"]
        A[React 19 App :5173] 
        B[Vanilla HTML/JS :5500]
    end

    subgraph Backend["⚡ API & Processing Layer"]
        C[FastAPI Server :8000]
        D[Celery Async Worker]
    end

    subgraph Infrastructure["🗄️ Database & Cache Layer"]
        E[(PostgreSQL DB :5432)]
        F[(Redis Broker :6379)]
    end

    subgraph External["☁️ External Services"]
        G[Google Gemini 2.5 Flash API]
        H[SMTP Email Server]
    end

    A -->|HTTP / REST API| C
    B -->|HTTP / REST API| C
    C -->|SQLAlchemy ORM| E
    C -->|Enqueue Async Tasks| F
    F -->|Pull Tasks| D
    D -->|Write Logs / Query| E
    D -->|Send Emails| H
    C -->|Vector RAG & System Prompts| G
```

---

## 📂 Directory Structure

```text
Ecommerce API/
├── ecommerce_api/              ← Backend Python Application Package
│   ├── main.py                 ← FastAPI initialization, CORS, and auto-seeding
│   ├── database.py             ← SQLAlchemy database engine & SessionLocal session builder
│   ├── models.py               ← Database entities (User, Product, CartItem, Order, Review, Wishlist, Promo)
│   ├── schemas.py              ← Pydantic request/response validation schemas
│   ├── celery_app.py           ← Celery application instance & configuration
│   ├── tasks.py                ← Background async jobs (order confirmations, email delivery)
│   ├── routers/                ← Modular API endpoint handlers
│   │   ├── admin.py            ← Admin analytics, product management, user management & CSV export
│   │   ├── auth.py             ← User registration, login, token refresh, and profile endpoints
│   │   ├── cart.py             ← Shopping cart CRUD operations & totals
│   │   ├── chat.py             ← RAG Vector AI Customer Support Assistant endpoint
│   │   ├── orders.py           ← Order placement, inventory reduction, & order history
│   │   ├── products.py         ← Product catalog, text search, category filtering & detailed views
│   │   ├── reviews.py          ← Customer star ratings, text reviews & metric updates
│   │   └── wishlist.py         ← User wishlist save & remove operations
│   └── utils/
│       ├── auth.py             ← Password hashing (bcrypt) & JWT token handling
│       ├── deps.py             ← FastAPI security context injectors (Current User / Admin)
│       └── embeddings.py       ← Vector embedding helper and cosine similarity metrics
├── frontend-react/             ← Modern React 19 Frontend Client
│   ├── src/
│   │   ├── components/         ← Navbar, Footer, Support Chatbot, ProductCard, ScrollReveal
│   │   ├── pages/              ← Catalog, Home, ProductDetail, Cart, Wishlist, Orders, Dashboard, Auth
│   │   ├── api.js              ← Axios/Fetch wrapper, token interceptors & toast notifications
│   │   ├── index.css           ← Tailwind CSS v4 setup and theme styling
│   │   └── App.jsx             ← React App routes & layout entrypoint
│   ├── vite.config.js          ← Vite build configuration & API dev proxy server
│   └── package.json            ← Dependencies & scripts
├── frontend/                   ← Classic Vanilla JS Frontend Client
│   ├── index.html              ← Responsive store layout
│   ├── style.css               ← Pure CSS variables, flex/grid layouts, animations
│   ├── api.js                  ← LocalStorage token wrapper & custom toast library
│   └── admin/                  ← Standalone static admin workspace
├── alembic/                    ← Database schema migration versions & env.py
├── alembic.ini                 ← Alembic CLI configuration
├── docker-compose.yml          ← Orchestrates Web, Worker, PostgreSQL, and Redis containers
├── Dockerfile                  ← Container image definition for FastAPI API & Celery Worker
├── requirements.txt            ← Python dependency manifest
└── .env                        ← Local environment configuration file
```

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

Run the complete stack (FastAPI Backend, Celery Worker, PostgreSQL Database, and Redis Broker) in containers with a single command:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/ecommerce-api.git
   cd ecommerce-api
   ```

2. **Configure Environment Variables:**
   Copy `.env` configuration (or create a `.env` file in the root folder):
   ```bash
   cp .env.example .env
   ```

3. **Launch Stack:**
   ```bash
   docker-compose up --build
   ```

4. **Access Applications:**
   - **FastAPI REST API**: [`http://127.0.0.1:8000`](http://127.0.0.1:8000)
   - **Interactive Swagger Docs**: [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs)
   - **ReDoc Documentation**: [`http://127.0.0.1:8000/redoc`](http://127.0.0.1:8000/redoc)

---

### Option 2: Manual Local Setup

#### Prerequisites
- **Python**: 3.11 or higher
- **Node.js**: 18+ (for React Frontend)
- **PostgreSQL**: Server running locally on port `5432`
- **Redis**: Server running locally on port `6379` (required for Celery worker)

#### 1. Setup Backend Environment
```bash
# Create and activate Python virtual environment
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql+psycopg2://postgres:root@localhost:5432/ecommerce_db
SECRET_KEY=your_super_secret_jwt_access_key
REFRESH_SECRET_KEY=your_super_secret_jwt_refresh_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional Email SMTP Settings (If empty, emails are logged to logs/ directory)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SENDER_EMAIL=noreply@shopeasy.com
```

#### 3. Database Migration & Start Server
```bash
# Apply migrations
alembic upgrade head

# Start FastAPI development server
uvicorn ecommerce_api.main:app --reload --port 8000
```
> *Note: On startup, FastAPI will automatically seed default Admin and Customer accounts, sample products, and promotional discount codes if the database is empty.*

#### 4. Run Celery Background Worker (Optional)
In a separate terminal window with the virtual environment activated:
```bash
# On Linux / macOS:
celery -A ecommerce_api.celery_app.celery_app worker --loglevel=info

# On Windows (requires eventlet):
pip install eventlet
celery -A ecommerce_api.celery_app.celery_app worker --loglevel=info -P eventlet
```

#### 5. Run React 19 Frontend
```bash
cd frontend-react
npm install
npm run dev
```
Open [`http://localhost:5173`](http://localhost:5173) in your browser. API requests to `/api/*` are automatically proxied to the FastAPI server at `http://127.0.0.1:8000`.

#### 6. Run Classic Vanilla Frontend (Alternative)
```bash
cd frontend
python -m http.server 5500
```
Open [`http://127.0.0.1:5500`](http://127.0.0.1:5500) in your browser.

---

## 🔑 Pre-configured Test Credentials

On initial setup, the system automatically populates sample database entities for immediate testing:

### User Accounts
| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@shop.com` | `admin123` | Full access to Admin Dashboard, Analytics, User Roster & Inventory CRUD |
| **Customer** | `user@shop.com` | `user123` | Standard shopper account (Cart, Orders, Wishlist, Reviews) |

### Active Promo Codes
| Promo Code | Discount Details | Minimum Order Amount | Rules / Capping |
| :--- | :--- | :--- | :--- |
| `WELCOME10` | 10% OFF | ₹500.00 | Applied to total order sum |
| `FLAT100` | Flat ₹100.00 OFF | ₹500.00 | Direct price reduction |
| `SAVE20` | 20% OFF | ₹1000.00 | Maximum discount capped at ₹500.00 |

---

## ⚙️ Environment Variables

| Variable Name | Required | Default / Example | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgresql+psycopg2://postgres:root@localhost:5432/ecommerce_db` | SQLAlchemy PostgreSQL connection URI |
| `SECRET_KEY` | **Yes** | `your_super_secret_jwt_access_key` | Secret key used for signing JWT Access tokens |
| `REFRESH_SECRET_KEY` | **Yes** | `your_super_secret_jwt_refresh_key` | Secret key used for signing JWT Refresh tokens |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` | Access token lifespan in minutes |
| `REFRESH_TOKEN_EXPIRE_DAYS` | No | `7` | Refresh token lifespan in days |
| `GEMINI_API_KEY` | No | `AIzaSy...` | Google Gemini API key for AI chatbot integration |
| `CELERY_BROKER_URL` | No | `redis://localhost:6379/0` | Message broker URL for Celery task dispatch |
| `CELERY_RESULT_BACKEND` | No | `redis://localhost:6379/0` | Result storage backend URL for Celery |
| `SMTP_SERVER` | No | `smtp.gmail.com` | SMTP host for email task sending |
| `SMTP_PORT` | No | `587` | SMTP server port |
| `SMTP_USERNAME` | No | `your_email@gmail.com` | SMTP login account username |
| `SMTP_PASSWORD` | No | `your_app_password` | SMTP account application password |
| `SENDER_EMAIL` | No | `noreply@shopeasy.com` | From address for automated store notification emails |

---

## 📡 Complete API Route Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account & receive Access + Refresh tokens |
| `POST` | `/api/auth/login` | Public | Authenticate credentials & return token pair with user profile |
| `POST` | `/api/auth/refresh` | Public | Generate a new Access Token using a valid Refresh Token |
| `GET` | `/api/auth/me` | User | Fetch profile information for the authenticated user |

### 📦 Product Catalog (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/products` | Public | Fetch product list with text search, category filtering & price sorting |
| `GET` | `/api/products/categories` | Public | List all unique active product categories |
| `GET` | `/api/products/{id}` | Public | Fetch detailed product information along with customer reviews |

### 🛒 Shopping Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/cart` | User | Retrieve current user's active shopping cart items and price breakdown |
| `POST` | `/api/cart` | User | Add item to cart (automatically increments quantity if item exists) |
| `PUT` | `/api/cart/{item_id}` | User | Update quantity for a specific cart item |
| `DELETE` | `/api/cart/{item_id}` | User | Remove single product item from user cart |
| `DELETE` | `/api/cart` | User | Clear all items inside user cart |

### 🧾 Orders & Checkout (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/orders` | User | Checkout cart items, apply promo code, validate stock, & queue confirmation |
| `GET` | `/api/orders` | User | Retrieve order history for the current authenticated user |
| `GET` | `/api/orders/{id}` | User | Retrieve detailed item summary and shipping status for a single order |

### 🌟 Reviews & Ratings (`/api/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/reviews` | User | Submit rating (1 to 5 stars) and review text; recalculates product score |
| `GET` | `/api/reviews/{product_id}`| Public | List customer reviews for a given product ID |
| `DELETE` | `/api/reviews/{id}` | User | Delete owned review and update aggregate product rating |

### 💖 Wishlist (`/api/wishlist`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/wishlist` | User | Retrieve current user's saved wishlist catalog items |
| `POST` | `/api/wishlist` | User | Add product entry to user wishlist |
| `DELETE` | `/api/wishlist/{product_id}`| User | Remove item from user wishlist |

### 🤖 AI Support Chat (`/api/chat`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/chat` | Public / User | AI Support Bot endpoint utilizing Vector RAG & Gemini 2.5 Flash API |

### 🛡️ Admin Management (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Fetch revenue statistics, total orders, user counts & low-stock alerts |
| `GET` | `/api/admin/products` | Admin | List all product records (including inactive / soft-deleted items) |
| `POST` | `/api/admin/products` | Admin | Create a new product entry in the catalog |
| `PUT` | `/api/admin/products/{id}`| Admin | Modify details for an existing catalog product |
| `DELETE` | `/api/admin/products/{id}`| Admin | Soft-delete a product record (toggles `is_active` status) |
| `GET` | `/api/admin/orders` | Admin | View system-wide order ledger with status filters |
| `PUT` | `/api/admin/orders/{id}/status`| Admin | Update order status (`pending`, `shipped`, `delivered`, `cancelled`) |
| `GET` | `/api/admin/orders/export` | Admin | Export all system order records as a downloadable `.csv` file |
| `GET` | `/api/admin/users` | Admin | List all registered user account records |
| `GET` | `/api/admin/promo` | Admin | Fetch system-wide list of promotional discount codes |
| `POST` | `/api/admin/promo` | Admin | Create new promotional discount code rule |
| `PUT` | `/api/admin/promo/{id}` | Admin | Toggle promo code status (active vs inactive) |

---

## 🗄️ Database Migrations (Alembic)

Database schema alterations are tracked using **Alembic**. Useful migration commands:

```bash
# Generate a new migration script after changing models in ecommerce_api/models.py
alembic revision --autogenerate -m "Add new column or model"

# Upgrade database to latest revision
alembic upgrade head

# Rollback last migration step
alembic downgrade -1

# View migration history
alembic history
```

---

## 🤖 AI Support Chatbot Architecture

The AI Chatbot integrated in ShopEasy provides intelligent customer assistant capabilities:

1. **Embedding Generation & Vector Retrieval**:
   - Computes query embeddings to perform cosine similarity calculations against active product description vectors in PostgreSQL.
   - Retrieves the top matching product candidates to supply factual context.
2. **Context Enrichment**:
   - Injects current user session details (order numbers, delivery tracking states, name).
   - Injects active promotional coupon codes and store policies (e.g. 30-day return policy).
3. **Generative Processing**:
   - Dispatches structured prompts to `gemini-2.5-flash`.
   - Returns clear, markdown-formatted responses with bullet points and links.

---

## 🔍 Troubleshooting & FAQ

<details>
<summary><b>1. Celery Worker fails to run on Windows</b></summary>

*Cause*: Celery standard prefork pool is not natively supported on Windows.  
*Solution*: Install `eventlet` and run the Celery worker with the eventlet pool flag:
```bash
pip install eventlet
celery -A ecommerce_api.celery_app.celery_app worker --loglevel=info -P eventlet
```
</details>

<details>
<summary><b>2. AI Chatbot returns "Offline Mode" response</b></summary>

*Cause*: `GEMINI_API_KEY` is not defined in `.env`.  
*Solution*: Obtain an API key from [Google AI Studio](https://aistudio.google.com/) and place it in your `.env` file:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
Restart the FastAPI server after adding the key.
</details>

<details>
<summary><b>3. Database Connection Failed during local startup</b></summary>

*Cause*: PostgreSQL server is not running or database credentials in `DATABASE_URL` do not match.  
*Solution*: Verify PostgreSQL is active on port `5432` and check your username/password in `.env`. The backend automatically creates the `ecommerce_db` database if credentials are correct.
</details>

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ using FastAPI, React 19, PostgreSQL & Google Gemini AI</sub>
</div>
