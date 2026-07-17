const API = ''; // Requests are local proxy redirect in dev, relative in production

export function getToken() {
    return localStorage.getItem('token');
}

export function getUser() {
    const userStr = localStorage.getItem('user');
    try {
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
}

export async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = options.headers || {};

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
            // Redirect to React HashRouter Login path
            window.location.hash = '#/login';
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

// React Toast Notification utility using dynamic Tailwind v4 elements
export function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.top = '24px';
        container.style.right = '24px';
        container.style.zIndex = '100000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '12px';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColors = {
        success: 'bg-emerald-600 text-white',
        error: 'bg-rose-600 text-white',
        info: 'bg-blue-600 text-white',
        warning: 'bg-amber-500 text-slate-900'
    };

    toast.className = `flex items-center justify-between gap-4 px-5 py-3 rounded-lg shadow-xl text-sm font-medium transition-all duration-300 transform translate-x-full opacity-0 ${bgColors[type] || bgColors.info}`;
    toast.innerHTML = `
    <span>${message}</span>
    <button class="text-lg font-bold hover:opacity-75 focus:outline-none cursor-pointer">&times;</button>
  `;

    container.appendChild(toast);

    // Slide-in animation hook
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 10);

    const removeToast = () => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    };

    // Auto remove after 3.5 seconds
    const autoRemove = setTimeout(removeToast, 3500);

    // Manual button dismiss
    toast.querySelector('button').onclick = () => {
        clearTimeout(autoRemove);
        removeToast();
    };
}
