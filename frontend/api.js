const API = 'http://127.0.0.1:8000';

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  
  // Do not set Content-Type header if body is FormData
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  
  try {
    const res = await fetch(API + path, { ...options, headers });
    
    if (res.status === 401) {
      localStorage.clear();
      const currentPath = window.location.pathname;
      if (!currentPath.endsWith('/login.html') && !currentPath.endsWith('/register.html')) {
        window.location = 'login.html';
      }
      return null;
    }
    
    if (res.status === 204) {
      return null;
    }
    
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }
      return data;
    }
    
    if (contentType && contentType.includes('text/csv')) {
      return await res.blob();
    }
    
    const text = await res.text();
    if (!res.ok) {
      throw new Error(text || 'Something went wrong');
    }
    return text;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// Toast Notifications Helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close">&times;</button>
  `;
  
  container.appendChild(toast);
  
  // Trigger transition
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto remove
  const autoRemove = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
  
  // Manual close
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(autoRemove);
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  });
}
