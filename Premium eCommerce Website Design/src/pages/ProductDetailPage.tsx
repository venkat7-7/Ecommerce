import { useState } from 'react'
import { Heart, ShoppingBag, Zap, Star, Shield, Truck, RefreshCw, ChevronDown, ChevronUp, Share2, Minus, Plus, ZoomIn } from 'lucide-react'
import { products } from '../data/products'
import type { Product } from '../data/products'
import ProductCard from '../components/ProductCard'

interface ProductDetailProps {
  productId: number
  onNavigate: (page: string, productId?: number) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
  wishlistedIds: number[]
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < Math.floor(rating) ? '#F59E0B' : 'none'} style={{ color: i < Math.floor(rating) ? '#F59E0B' : 'var(--border)' }} />
        ))}
      </div>
      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{rating}</span>
      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>({reviews.toLocaleString()} reviews)</span>
    </div>
  )
}

export default function ProductDetailPage({ productId, onNavigate, onAddToCart, onToggleWishlist, wishlistedIds }: ProductDetailProps) {
  const product = products.find(p => p.id === productId) || products[0]
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>('description')
  const [adding, setAdding] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  const isWishlisted = wishlistedIds.includes(product.id)

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 1) { setSizeError(true); return }
    setSizeError(false)
    setAdding(true)
    onAddToCart({ ...product })
    setTimeout(() => setAdding(false), 1500)
  }

  const accordions = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'features', label: 'Features & Materials', content: product.features.join(' · ') },
    { id: 'delivery', label: 'Delivery & Returns', content: 'Free standard shipping on orders over $150. Express delivery available at checkout. Returns accepted within 30 days in original condition.' },
    { id: 'care', label: 'Care Instructions', content: 'Follow care label instructions. Store in the included dust bag when not in use. Avoid prolonged exposure to direct sunlight.' },
  ]

  return (
    <div className="page-transition max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--muted-foreground)' }}>
        <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('listing')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>{product.category}</button>
        <span>/</span>
        <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
        {/* Image Gallery */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all"
                style={{
                  border: selectedImage === i ? '2px solid var(--accent)' : '2px solid var(--border)',
                  cursor: 'pointer',
                  background: 'var(--muted)',
                }}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 relative">
            <div
              className="rounded-2xl overflow-hidden aspect-square relative cursor-zoom-in img-zoom"
              style={{ background: 'var(--muted)' }}
              onClick={() => setZoomed(true)}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', color: '#111111' }}
              >
                <ZoomIn size={16} />
              </button>
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <span
                    className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide text-white"
                    style={{ background: product.badge === 'Sale' ? '#EF4444' : product.badge === 'New' ? '#5B8DEF' : product.badge === 'Limited' ? '#111111' : '#F59E0B' }}
                  >
                    {product.badge}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Zoom Modal */}
        {zoomed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setZoomed(false)}>
            <img src={product.images[selectedImage]} alt={product.name} className="max-w-4xl max-h-[90vh] w-full object-contain rounded-2xl" />
          </div>
        )}

        {/* Product Info */}
        <div>
          {/* Brand & Rating */}
          <div className="flex items-start justify-between mb-3">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>{product.brand}</span>
            <button
              style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Share2 size={18} />
            </button>
          </div>

          <h1
            className="text-3xl lg:text-4xl font-black tracking-tight mb-3"
            style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
          >
            {product.name}
          </h1>

          <StarRating rating={product.rating} reviews={product.reviews} />

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5 mb-6">
            <span className="text-3xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xl line-through" style={{ color: 'var(--muted-foreground)' }}>${product.originalPrice}</span>
            )}
            {product.discount && (
              <span className="px-2.5 py-1 rounded-lg text-sm font-bold text-white" style={{ background: '#EF4444' }}>
                {product.discount}% off
              </span>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full" style={{ background: product.inStock ? '#22C55E' : '#EF4444' }} />
            <span className="text-sm font-medium" style={{ color: product.inStock ? '#22C55E' : '#EF4444' }}>
              {product.inStock ? `In Stock${product.stockCount && product.stockCount < 10 ? ` — Only ${product.stockCount} left` : ''}` : 'Out of Stock'}
            </span>
          </div>

          {/* Color Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Color</p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selectedColor || 'Select color'}</p>
            </div>
            <div className="flex gap-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  className="w-9 h-9 rounded-full transition-all hover:scale-110"
                  style={{
                    background: color,
                    border: selectedColor === color ? '2px solid var(--accent)' : '2px solid var(--border)',
                    outline: selectedColor === color ? '3px solid var(--accent)' : 'none',
                    outlineOffset: '2px',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          {product.sizes.length > 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold" style={{ color: sizeError ? '#EF4444' : 'var(--foreground)' }}>
                  {sizeError ? 'Please select a size' : 'Size'}
                </p>
                <button className="text-sm font-medium" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false) }}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                    style={{
                      background: selectedSize === size ? 'var(--primary)' : 'var(--card)',
                      color: selectedSize === size ? 'var(--primary-foreground)' : 'var(--foreground)',
                      border: selectedSize === size ? '1.5px solid transparent' : `1.5px solid ${sizeError ? '#EF4444' : 'var(--border)'}`,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Quantity</p>
            <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid var(--border)', background: 'var(--card)' }}>
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-bold" style={{ color: 'var(--foreground)' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85"
              style={{
                background: adding ? '#22C55E' : 'var(--primary)',
                color: 'var(--primary-foreground)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <ShoppingBag size={18} />
              {adding ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={() => onToggleWishlist(product.id)}
              className="w-14 flex items-center justify-center rounded-xl transition-all hover:opacity-80"
              style={{
                background: isWishlisted ? '#FFF1F1' : 'var(--card)',
                border: '1.5px solid',
                borderColor: isWishlisted ? '#EF4444' : 'var(--border)',
                cursor: 'pointer',
                color: isWishlisted ? '#EF4444' : 'var(--foreground)',
              }}
              aria-label="Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? '#EF4444' : 'none'} />
            </button>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 mb-6"
            style={{ background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            <Zap size={16} /> Buy Now
          </button>

          {/* Trust icons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, text: 'Free Delivery' },
              { icon: RefreshCw, text: '30-Day Returns' },
              { icon: Shield, text: 'Secure Checkout' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 text-center p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                <Icon size={18} style={{ color: 'var(--accent)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Accordions */}
          <div className="space-y-2">
            {accordions.map(({ id, label, content }) => (
              <div key={id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === id ? null : id)}
                  className="w-full flex items-center justify-between px-4 py-4 text-sm font-semibold"
                  style={{ background: 'var(--card)', color: 'var(--foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  {label}
                  {openAccordion === id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === id && (
                  <div className="px-4 pb-4 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)', background: 'var(--card)' }}>
                    {content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mb-20">
          <h2 className="text-2xl font-black tracking-tight mb-8" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            You may also like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistedIds.includes(p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews section */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            Reviews ({product.reviews.toLocaleString()})
          </h2>
          <button
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Write a Review
          </button>
        </div>

        {/* Rating breakdown */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div
            className="col-span-1 flex flex-col items-center justify-center p-8 rounded-2xl"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <span className="text-6xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>{product.rating}</span>
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
            </div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{product.reviews.toLocaleString()} reviews</p>
          </div>

          <div className="col-span-2 flex flex-col justify-center gap-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const pct = stars === 5 ? 72 : stars === 4 ? 18 : stars === 3 ? 7 : stars === 2 ? 2 : 1
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm w-6" style={{ color: 'var(--muted-foreground)' }}>{stars}</span>
                  <Star size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#F59E0B' }} />
                  </div>
                  <span className="text-sm w-8 text-right" style={{ color: 'var(--muted-foreground)' }}>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sample reviews */}
        <div className="space-y-4">
          {[
            { name: 'James R.', rating: 5, date: 'March 2026', text: 'Exceeded all expectations. The quality is exactly as described — you can feel the craftsmanship in every detail. Will definitely be ordering again.' },
            { name: 'Elena V.', rating: 5, date: 'February 2026', text: 'The fit is perfect and the materials feel premium. Arrived well packaged with a thoughtful unboxing experience. Highly recommend.' },
          ].map((r, i) => (
            <div key={i} className="p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{r.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{r.date} · Verified Purchase</p>
                </div>
                <div className="flex">
                  {[...Array(r.rating)].map((_, j) => <Star key={j} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
