# ShopEasy React Frontend

This directory contains the modern customer store and admin dashboard built with **React 19**, **Vite**, **Tailwind CSS v4**, **React Router v7**, and **Lucide React**.

---

## Features

### 🎨 Theme & Layout
- **Dynamic Dark/Light Mode**: Full dark theme support toggled from the navigation bar, with theme persistence saved in the browser's `localStorage`.
- **Responsive Layout**: Designed with fluid Tailwind v4 utility grids, flex layouts, and custom media queries for seamless mobile, tablet, and desktop views.
- **Scroll Reveal Animations**: Elegant slide-in and fade-in animations on page load and scrolling via the reusable `ScrollReveal` component.

### 👥 Customer Storefront Pages
- **Home (`Home.jsx`)**: Premium hero banner, features overview, dynamic promo alerts, and featured product grids.
- **Catalog (`Catalog.jsx`)**: Complete store inventory list with text search, categories filters, and price sorting.
- **Product Detail (`ProductDetail.jsx`)**: Full view of specifications, stock status indicator, user reviews list, write-a-review form, and related items suggestions.
- **Shopping Cart (`Cart.jsx`)**: Interactive cart with quantity controls, items removal, promo code validation (applying capped or flat discounts), shipping address form, and checkout flow.
- **Wishlist (`Wishlist.jsx`)**: Saved items bookmark list for authenticated users.
- **Orders (`Orders.jsx`)**: Personal history tracking table displaying purchase timestamp, invoice reference code, status tags, and ordered items details.

- **AI Chatbot Assistant (`Chatbot.jsx`)**: Reusable floating chatbot backed by Google Gemini (using `gemini-2.5-flash` and `text-embedding-004`) that fetches matching catalog items, discount rules, and customer purchase histories via Vector RAG.

### 🔒 Authentication
- **Login & Register (`Login.jsx`, `Register.jsx`)**: Customer & Admin session auth flow. Validates credentials, issues JWT access and refresh tokens, and manages authentication headers.

### 📊 Admin Workspace
- **Admin Dashboard (`AdminDashboard.jsx`)**:
  - **Analytics Cards**: High-visibility sales aggregates, total orders count, users signup volume, and average order value metrics.
  - **Interactive Charts**: Interactive charts indicating recent sales distributions.
  - **Catalog Management**: Add new products, edit details/pricing/stock, and soft-delete/deactivate catalog items.
  - **Orders Ledger**: Review orders system-wide, update progress status (Pending, Shipped, Delivered, Cancelled), and export complete records to CSV.
  - **Promo Management**: Add promo codes, set minimum spends or discount limits, and toggle promo states (Active/Inactive).

---

## Directory Structure

```text
frontend-react/
├── public/                 ← Static public assets
├── src/
│   ├── assets/             ← Local images and logo resources
│   ├── components/
│   │   ├── Navbar.jsx      ← Global dynamic header (auth status sensitive)
│   │   ├── Footer.jsx      ← Dynamic footer layout
│   │   ├── ProductCard.jsx ← Reusable card component (cart/wishlist quick controls)
│   │   ├── Chatbot.jsx     ← Floating customer-support chat simulator
│   │   └── ScrollReveal.jsx← Scroll-triggered transition effects wrapper
│   │
│   ├── pages/
│   │   ├── Home.jsx           ← Main home landing page
│   │   ├── Catalog.jsx        ← Product library and listing
│   │   ├── ProductDetail.jsx  ← Details, reviews, and write-a-review form
│   │   ├── Cart.jsx           ← Checkout form & items summary
│   │   ├── Wishlist.jsx       ← Saved customer items
│   │   ├── Orders.jsx         ← Customer purchase history tracker
│   │   ├── Login.jsx          ← Sign-in panel
│   │   ├── Register.jsx       ← Sign-up panel
│   │   └── AdminDashboard.jsx ← Admin interface, analytics, & tables
│   │
│   ├── api.js              ← Base fetch API client & toast notifications helper
│   ├── index.css           ← Base Tailwind directives and custom variables
│   ├── App.jsx             ← Router configuration and Dark Mode layout container
│   └── main.jsx            ← React mounting entrypoint
│
├── vite.config.js          ← Build settings and API proxy configuration
├── package.json            ← Dependencies & scripts
└── .gitignore              ← React git rules
```

---

## Getting Started

### 1. Install Node.js
Ensure you have **Node.js (v18+)** and **npm** installed on your local system.

### 2. Install Project Dependencies
Run this command from inside the `frontend-react` directory:
```bash
npm install
```

### 3. Run Development Server
Start the local server with hot-reloading:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

*Note on Local Development Proxy: The dev server is configured with a proxy mapping inside `vite.config.js`. Requests targeting `/api/*` will automatically redirect to the backend running at `http://127.0.0.1:8000` to prevent CORS issues.*

### 4. Build for Production
Bundle the project output into optimized static assets in the `/dist` directory:
```bash
npm run build
```

### 5. Code Quality (Linting)
Check for syntax warnings or code errors using **Oxlint**:
```bash
npm run lint
```
