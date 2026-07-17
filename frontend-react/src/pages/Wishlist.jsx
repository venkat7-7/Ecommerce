import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { apiFetch, showToast, getToken } from '../api';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/wishlist');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast('Failed to load wishlist: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      showToast('Login required to access wishlist!', 'error');
      navigate('/login');
      return;
    }
    loadWishlist();
  }, []);

  const handleRemove = async (prodId) => {
    try {
      await apiFetch(`/api/wishlist/${prodId}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item.product_id !== prodId));
      showToast('Removed from wishlist!', 'success');
    } catch (e) {
      showToast('Failed to remove: ' + e.message, 'error');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await apiFetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      });
      showToast('Added to cart!', 'success');
      window.dispatchEvent(new Event('update-cart-badge'));
    } catch (e) {
      showToast('Could not add to cart: ' + e.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="spinner w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="page-transition max-w-[1440px] mx-auto px-6 lg:px-12 py-8 text-left">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
          Your Wishlist
          {items.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({items.length} saved)</span>}
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-transparent max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-slate-50 dark:bg-zinc-900 text-slate-400">
            <Heart size={28} />
          </div>
          <p className="text-slate-400 font-semibold">Your wishlist is currently empty.</p>
          <Link to="/products" className="btn-primary py-2.5 px-6 rounded-xl text-xs uppercase font-bold tracking-wider no-underline inline-block border-none">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            // Map item.product structure to standard product
            const standardProduct = {
              id: item.product_id,
              name: item.product.name,
              price: item.product.price,
              image_url: item.product.image_url,
              category: item.product.category,
              stock_quantity: item.product.stock_quantity,
              avg_rating: item.product.avg_rating || 5.0,
              review_count: item.product.review_count || 0
            };
            return (
              <ProductCard
                key={item.id}
                product={standardProduct}
                isWishlisted={true}
                onToggleWishlist={handleRemove}
                onAddToCart={handleAddToCart}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
