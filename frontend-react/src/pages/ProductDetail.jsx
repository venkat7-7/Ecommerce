import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Shield, Truck, RefreshCw, Minus, Plus, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import { apiFetch, showToast, getToken, getUser } from '../api';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = parseInt(id);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistUpdating, setWishlistUpdating] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // AI summary states
  const [aiSummary, setAiSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  // New review state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const currentUser = getUser();

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodData, reviewsData] = await Promise.all([
        apiFetch(`/api/products/${productId}`),
        apiFetch(`/api/reviews/${productId}`),
      ]);
      setProduct(prodData);
      setReviews(reviewsData || []);

      // Load AI summary asynchronously if there are reviews
      if (prodData.review_count > 0) {
        fetchAiSummary();
      } else {
        setAiSummary('');
      }

      // Fetch related products (same category)
      const allProducts = await apiFetch('/api/products');
      if (Array.isArray(allProducts)) {
        setRelatedProducts(
          allProducts.filter((p) => p.id !== productId && p.category === prodData.category).slice(0, 4)
        );
      }
    } catch (err) {
      showToast('Error loading product details: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAiSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await apiFetch(`/api/reviews/${productId}/summary`);
      if (res && res.summary) {
        setAiSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to load review summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const checkWishlistStatus = async () => {
    if (!getToken()) return;
    try {
      const wishlist = await apiFetch('/api/wishlist');
      if (Array.isArray(wishlist)) {
        setIsWishlisted(wishlist.some((item) => item.product_id === productId));
      }
    } catch (err) {
      console.error('Wishlist check error:', err);
    }
  };

  useEffect(() => {
    loadData();
    checkWishlistStatus();
    setQuantity(1);
  }, [productId]);

  const handleAddToCart = async () => {
    if (!getToken()) {
      showToast('Login required to add items to cart!', 'error');
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    try {
      await apiFetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      showToast('Added to cart!', 'success');
      window.dispatchEvent(new Event('update-cart-badge'));
    } catch (err) {
      showToast('Could not add to cart: ' + err.message, 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!getToken()) {
      showToast('Login required to update wishlist!', 'error');
      navigate('/login');
      return;
    }
    setWishlistUpdating(true);
    try {
      if (isWishlisted) {
        await apiFetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
        setIsWishlisted(false);
        showToast('Removed from wishlist!', 'info');
      } else {
        await apiFetch('/api/wishlist', {
          method: 'POST',
          body: JSON.stringify({ product_id: productId }),
        });
        setIsWishlisted(true);
        showToast('Added to wishlist!', 'success');
      }
    } catch (err) {
      showToast('Error updating wishlist: ' + err.message, 'error');
    } finally {
      setWishlistUpdating(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingReview(true);
    try {
      await apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment: comment.trim(),
        }),
      });
      showToast('Review submitted successfully!', 'success');
      setComment('');
      setRating(5);
      // Reload reviews and summary
      await loadData();
    } catch (err) {
      showToast('Failed to submit review: ' + err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await apiFetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
      showToast('Review deleted!', 'info');
      await loadData();
    } catch (err) {
      showToast('Failed to delete review: ' + err.message, 'error');
    }
  };

  // Markdown list converter for AI summary
  const renderParsedMarkdown = (text) => {
    const lines = text.split('\n');
    let inList = false;
    let listItems = [];
    const elements = [];

    lines.forEach((line, index) => {
      let trimmed = line.trim();

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          inList = true;
        }
        let content = trimmed.replace(/^[\*\-]\s+/, '');
        content = content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
        listItems.push(
          <li
            key={`li-${index}`}
            className="mb-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      } else {
        if (inList) {
          elements.push(
            <ul key={`ul-${index}`} className="list-disc ml-6 my-2.5 space-y-1">
              {[...listItems]}
            </ul>
          );
          listItems = [];
          inList = false;
        }
        if (trimmed) {
          let content = trimmed
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
          elements.push(
            <p
              key={`p-${index}`}
              className="my-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
      }
    });

    if (inList) {
      elements.push(
        <ul key={`ul-end`} className="list-disc ml-6 my-2.5 space-y-1">
          {listItems}
        </ul>
      );
    }
    return elements;
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-12 text-left">
        <div className="flex items-center gap-2 text-xs mb-8 skeleton w-48 h-4 rounded" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-6">
            <div className="skeleton h-10 w-3/4 rounded-xl" />
            <div className="skeleton h-6 w-1/4 rounded-lg" />
            <div className="skeleton h-24 w-full rounded-xl" />
            <div className="skeleton h-12 w-1/2 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 rounded-3xl border bg-white dark:bg-zinc-950" style={{ borderColor: 'var(--border)' }}>
        <p className="text-red-500 font-medium">Product details could not be loaded.</p>
        <Link to="/products" className="text-blue-600 hover:underline mt-4 inline-block font-semibold">Back to Catalog</Link>
      </div>
    );
  }

  const averageRating = product.avg_rating ? parseFloat(product.avg_rating).toFixed(1) : '5.0';

  return (
    <div className="page-transition max-w-[1440px] mx-auto px-6 lg:px-12 py-8 text-left">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--muted-foreground)' }}>
        <Link to="/" className="hover:opacity-80 no-underline" style={{ color: 'var(--muted-foreground)' }}>Home</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:opacity-80 no-underline" style={{ color: 'var(--muted-foreground)' }}>{product.category}</Link>
        <span>/</span>
        <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main product card view */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
        
        {/* Main Image Area */}
        <div className="relative">
          <div
            className="rounded-3xl overflow-hidden aspect-square relative border img-zoom"
            style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
          >
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
              }}
            />
          </div>
        </div>

        {/* Specs detail area */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <span 
              className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
              style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
            >
              {product.category}
            </span>
            <h1 
              className="text-3xl sm:text-4xl font-black tracking-tight leading-tight" 
              style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
            >
              {product.name}
            </h1>

            {/* Ratings & reviews count */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    fill={idx < Math.round(averageRating) ? '#F59E0B' : 'none'}
                    style={{ color: idx < Math.round(averageRating) ? '#F59E0B' : 'var(--border)' }}
                  />
                ))}
              </div>
              <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>
                {averageRating}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                ({product.review_count || 0} customer reviews)
              </span>
            </div>
          </div>

          <div className="text-3xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            ₹{parseFloat(product.price).toFixed(2)}
          </div>

          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {product.description || 'No detailed description available.'}
          </p>

          {/* Stock quantities status indicators */}
          <div>
            {product.stock_quantity > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-3.5 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                ✔ In Stock ({product.stock_quantity} remaining)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 dark:text-red-400 px-3.5 py-1.5 rounded-xl border border-red-100 dark:border-red-900/30">
                ✖ Out of Stock
              </span>
            )}
          </div>

          {/* Quantity selector and checkout actions */}
          <div className="flex flex-wrap gap-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            {product.stock_quantity > 0 && (
              <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                <button
                  onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                  className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-slate-300 font-bold bg-transparent border-none cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-10 text-center text-sm font-bold bg-transparent border-none outline-none"
                  style={{ color: 'var(--foreground)' }}
                />
                <button
                  onClick={() => setQuantity(q => q < product.stock_quantity ? q + 1 : q)}
                  className="px-4 py-3 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-slate-300 font-bold bg-transparent border-none cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            {product.stock_quantity > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 btn-primary py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 border-none disabled:opacity-50"
              >
                <ShoppingBag size={16} />
                {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            )}

            <button
              onClick={handleWishlistToggle}
              disabled={wishlistUpdating}
              className="px-6 py-3 rounded-xl font-bold transition-all border text-sm flex items-center justify-center gap-2 bg-transparent"
              style={{ 
                color: isWishlisted ? '#EF4444' : 'var(--foreground)',
                borderColor: isWishlisted ? '#EF4444' : 'var(--border)',
                cursor: 'pointer'
              }}
            >
              <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} />
              <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Extra product trust highlights */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
            {[
              { icon: Truck, text: 'Fast Delivery' },
              { icon: Shield, text: 'Secure Checked' },
              { icon: RefreshCw, text: '30-Day Returns' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center p-3 rounded-xl border text-center" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                <item.icon size={16} style={{ color: 'var(--accent)' }} className="mb-1" />
                <span className="text-[10px] font-bold" style={{ color: 'var(--foreground)' }}>{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Reviews, AI review summaries, and custom review postings */}
      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Left Col: Review summary stats & writing submissions */}
        <div className="lg:col-span-1 space-y-6">
          
          <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            Ratings & Reviews
          </h2>

          {/* AI summaries section */}
          {product.review_count > 0 && (
            <div 
              className="glass p-6 rounded-2xl relative space-y-4"
              style={{ border: '1.5px dashed var(--accent)' }}
            >
              <h3 className="font-black flex items-center gap-1.5 text-xs uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                <span>✨ AI Feedback Summary</span>
              </h3>

              {loadingSummary ? (
                <div className="flex items-center gap-2 py-2 text-xs">
                  <span className="spinner w-4 h-4 border-2 border-t-blue-600 border-slate-200 rounded-full animate-spin"></span>
                  <span className="text-slate-400">Compiling overall summaries...</span>
                </div>
              ) : aiSummary ? (
                <div className="text-left text-sm leading-relaxed">
                  {renderParsedMarkdown(aiSummary)}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Reviews analysis not available.</p>
              )}
            </div>
          )}

          {/* Write a review forms */}
          <div className="p-6 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--foreground)' }}>
              Write a Review
            </h3>
            {getToken() ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Custom interactive hover stars rating input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Your Rating</label>
                  <div className="flex gap-1 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer hover:scale-110 transition-transform bg-transparent border-none"
                      >
                        <Star
                          size={22}
                          fill={(hoverRating || rating) >= star ? '#F59E0B' : 'none'}
                          style={{ color: (hoverRating || rating) >= star ? '#F59E0B' : 'var(--border)' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block">Your Feedback</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share details of your experience with this item..."
                    rows="4"
                    required
                    className="input-field w-full px-4 py-3 rounded-xl text-sm leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full btn-primary py-3 rounded-xl text-xs uppercase tracking-wider disabled:opacity-50 border-none"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed py-2">
                Please <Link to="/login" className="text-blue-500 font-bold hover:underline">login</Link> to post customer reviews.
              </p>
            )}
          </div>

        </div>

        {/* Right Col: Customer reviews listing details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>
              Customer Experience ({reviews.length})
            </h3>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-transparent">
              <MessageSquare size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-xs text-slate-400 font-semibold">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {reviews.map((rev) => {
                const revDate = new Date(rev.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                const isOwner = currentUser && rev.user_id === currentUser.id;

                return (
                  <div 
                    key={rev.id} 
                    className="p-5 rounded-2xl border relative text-left"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs" style={{ color: 'var(--foreground)' }}>
                          {rev.user?.full_name || 'Verified Buyer'}
                        </span>
                        
                        {/* Rating stars */}
                        <div className="flex items-center">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              size={10}
                              fill={idx < rev.rating ? '#F59E0B' : 'none'}
                              style={{ color: idx < rev.rating ? '#F59E0B' : 'var(--border)' }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400">{revDate}</span>
                        {isOwner && (
                          <button
                            onClick={() => handleReviewDelete(rev.id)}
                            className="text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {rev.comment || <span className="italic">No detailed comments left.</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-10 border-t space-y-6" style={{ borderColor: 'var(--border)' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">You might also like</p>
            <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              Related Products
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isWishlisted={false} // Simple placeholder since dynamic loading covers it
                onToggleWishlist={() => {}} // Disabled simple toggle for visual list click redirect
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
