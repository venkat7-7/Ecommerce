import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

const badgeColor = {
  New: '#5B8DEF',
  Sale: '#EF4444',
  'Best Seller': '#F59E0B',
  Limited: '#111111',
};

const colorPalette = ['#111111', '#5B8DEF', '#E4E4E7', '#C4A882'];

function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart, index = 0 }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    onAddToCart(product);
    setTimeout(() => setAdding(false), 1200);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  const formattedPrice = parseFloat(product.price).toFixed(2);
  const hasPromo = product.id % 2 === 0;
  const badgeLabel = hasPromo ? 'Sale' : product.id % 3 === 0 ? 'Best Seller' : 'New';
  const badgeBg = badgeColor[badgeLabel] || badgeColor.New;
  const originalPrice = (parseFloat(product.price) * 1.2).toFixed(2);
  const rating = product.avg_rating ? parseFloat(product.avg_rating).toFixed(1) : '5.0';
  const reviewCount = product.review_count || 0;
  const brandLabel = product.category || 'ShopEasy';

  return (
    <div
      className="group cursor-pointer card-hover rounded-2xl overflow-hidden product-card"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        animationDelay: `${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="no-underline block">
        <div className="relative img-zoom aspect-square overflow-hidden" style={{ background: 'var(--muted)' }}>
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
            }}
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide text-white"
              style={{ background: badgeBg }}
            >
              {badgeLabel}
            </span>
            {hasPromo && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ background: '#EF4444' }}>
                -20%
              </span>
            )}
          </div>

          <div
            className="absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10"
            style={{ transform: hovered ? 'translateX(0)' : 'translateX(48px)', opacity: hovered ? 1 : 0 }}
          >
            <button
              onClick={handleWishlistClick}
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{
                background: 'white',
                border: 'none',
                cursor: 'pointer',
                color: isWishlisted ? '#EF4444' : '#111111',
              }}
              aria-label="Wishlist"
            >
              <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{ background: 'white', border: 'none', cursor: 'pointer', color: '#111111' }}
              aria-label="Quick view"
            >
              <Eye size={16} />
            </button>
          </div>

          {product.stock_quantity > 0 ? (
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-300 z-10"
              style={{ transform: hovered ? 'translateY(0)' : 'translateY(100%)', opacity: hovered ? 1 : 0 }}
            >
              <button
                onClick={handleAddToCartClick}
                className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  background: adding ? '#22C55E' : '#111111',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <ShoppingBag size={16} />
                {adding ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          ) : (
            <div
              className="absolute bottom-0 left-0 right-0 py-2 text-center text-xs font-medium text-white z-10"
              style={{ background: 'rgba(239,68,68,0.85)' }}
            >
              Out of stock
            </div>
          )}

          {product.stock_quantity > 0 && product.stock_quantity < 10 && (
            <div
              className="absolute bottom-0 left-0 right-0 py-1 text-center text-xs font-medium text-white z-[5]"
              style={{ background: 'rgba(239,68,68,0.85)' }}
            >
              Only {product.stock_quantity} left
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {brandLabel}
            </span>
            <div className="flex items-center gap-1">
              <Star size={12} className="star-filled" fill="#F59E0B" />
              <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                {rating}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                ({reviewCount.toLocaleString()})
              </span>
            </div>
          </div>

          <h3
            className="text-sm font-semibold mb-3 leading-snug line-clamp-2"
            style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
          >
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            {colorPalette.map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border"
                style={{
                  background: color,
                  borderColor: 'var(--border)',
                  outline: '1.5px solid var(--background)',
                  outlineOffset: '1px',
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              ₹{formattedPrice}
            </span>
            {hasPromo && (
              <span className="text-sm line-through" style={{ color: 'var(--muted-foreground)' }}>
                ₹{originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default React.memo(ProductCard);
