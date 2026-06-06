document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
});

async function renderNavbar() {
  const navbarEl = document.getElementById("navbar");
  if (!navbarEl) return;
  
  const token = getToken();
  const user = getUser();
  
  let cartBadgeHtml = "";
  if (token) {
    try {
      const cart = await apiFetch("/api/cart");
      if (cart && cart.items && cart.items.length > 0) {
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartBadgeHtml = `<span class="cart-badge">${count}</span>`;
      }
    } catch (e) {
      console.error("Failed to load cart count:", e);
    }
  }
  
  const currentPath = window.location.pathname;
  const isHome = currentPath.endsWith("/index.html") || currentPath.endsWith("/") ? "active" : "";
  const isProducts = currentPath.endsWith("/products.html") || currentPath.endsWith("/product.html") ? "active" : "";
  const isCart = currentPath.endsWith("/cart.html") ? "active" : "";
  const isOrders = currentPath.endsWith("/orders.html") ? "active" : "";
  const isWishlist = currentPath.endsWith("/wishlist.html") ? "active" : "";
  
  let authSection = "";
  if (token && user) {
    // Check role to render an admin option if required
    let adminLink = "";
    if (user.role === 'admin') {
      adminLink = `<a href="admin/index.html" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px; margin-right: 8px;">Admin Page</a>`;
    }
    
    authSection = `
      <span class="user-email">${user.email}</span>
      ${adminLink}
      <button id="logout-btn" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;">Logout</button>
    `;
  } else {
    authSection = `
      <a href="login.html" class="navbar-item">Login</a>
      <a href="register.html" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px; color: #fff;">Register</a>
    `;
  }
  
  navbarEl.innerHTML = `
    <nav class="navbar">
      <div class="navbar-container">
        <a href="index.html" class="navbar-logo">
          🛍️ ShopEasy
        </a>
        
        <button class="nav-toggle" id="nav-toggle-btn">
          &#9776;
        </button>
        
        <div class="navbar-links" id="navbar-links-container">
          <a href="index.html" class="navbar-item ${isHome}">Home</a>
          <a href="products.html" class="navbar-item ${isProducts}">Products</a>
          <a href="cart.html" class="navbar-item ${isCart}">
            <span class="cart-badge-wrapper">
              Cart
              ${cartBadgeHtml}
            </span>
          </a>
          ${token ? `<a href="orders.html" class="navbar-item ${isOrders}">My Orders</a>` : ""}
          ${token ? `<a href="wishlist.html" class="navbar-item ${isWishlist}">Wishlist</a>` : ""}
          <div class="navbar-auth">
            ${authSection}
          </div>
        </div>
      </div>
    </nav>
  `;
  
  // Mobile navigation drawer toggle
  const toggleBtn = document.getElementById("nav-toggle-btn");
  const navLinks = document.getElementById("navbar-links-container");
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
  
  // Logout handler
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      showToast("Logged out successfully!", "info");
      setTimeout(() => {
        window.location = "index.html";
      }, 500);
    });
  }
}

// Helper function to update cart counts dynamically on action
window.updateNavbarCartBadge = async function() {
  const token = getToken();
  if (!token) return;
  try {
    const cart = await apiFetch("/api/cart");
    const badgeWrapper = document.querySelector(".cart-badge-wrapper");
    if (badgeWrapper) {
      // Clear old badge
      const oldBadge = badgeWrapper.querySelector(".cart-badge");
      if (oldBadge) oldBadge.remove();
      
      if (cart && cart.items && cart.items.length > 0) {
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const badgeSpan = document.createElement("span");
        badgeSpan.className = "cart-badge";
        badgeSpan.textContent = count;
        badgeWrapper.appendChild(badgeSpan);
      }
    }
  } catch (e) {
    console.error("Failed to dynamically update badge:", e);
  }
};
