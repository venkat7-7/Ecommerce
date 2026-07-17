import { useState } from 'react'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import type { Product } from '../data/products'

interface ProductCardProps {
  product: Product
  onNavigate: (page: string, productId?: number) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
  isWishlisted: boolean
}

export default function ProductCard({ product, onNavigate, onAddToCart, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAdding(true)
    onAddToCart(product)
    setTimeout(() => setAdding(false), 1200)
  }

  const badgeColor: Record<string, string> = {
    New: '#5B8DEF',
    Sale: '#EF4444',
    'Best Seller': '#F59E0B',
    Limited: '#111111',
  }

  return (
    <div
      className="group cursor-pointer card-hover rounded-2xl overflow-hidden"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onNavigate('product', product.id)}
    >
      {/* Image */}
      <div className="relative img-zoom aspect-square overflow-hidden" style={{ background: 'var(--muted)' }}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide text-white"
              style={{ background: badgeColor[product.badge] }}
            >
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold text-white" style={{ background: '#EF4444' }}>
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Actions on hover */}
        <div
          className="absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300"
          style={{ transform: hovered ? 'translateX(0)' : 'translateX(48px)', opacity: hovered ? 1 : 0 }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id) }}
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
            onClick={(e) => { e.stopPropagation(); onNavigate('product', product.id) }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{ background: 'white', border: 'none', cursor: 'pointer', color: '#111111' }}
            aria-label="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Add to Cart bar */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-300"
          style={{ transform: hovered ? 'translateY(0)' : 'translateY(100%)', opacity: hovered ? 1 : 0 }}
        >
          <button
            onClick={handleAddToCart}
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

        {/* Low stock */}
        {product.stockCount && product.stockCount < 10 && (
          <div className="absolute bottom-0 left-0 right-0 py-1 text-center text-xs font-medium text-white" style={{ background: 'rgba(239,68,68,0.85)' }}>
            Only {product.stockCount} left
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="star-filled" fill="#F59E0B" />
            <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{product.rating}</span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>({product.reviews.toLocaleString()})</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold mb-3 leading-snug" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
          {product.name}
        </h3>

        {/* Colors */}
        <div className="flex items-center gap-1.5 mb-3">
          {product.colors.slice(0, 4).map((color) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border"
              style={{ background: color, borderColor: 'var(--border)', outline: '1.5px solid var(--background)', outlineOffset: '1px' }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm line-through" style={{ color: 'var(--muted-foreground)' }}>
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
