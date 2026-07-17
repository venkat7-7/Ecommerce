import { Heart, ShoppingBag, Share2, Trash2 } from 'lucide-react'
import { products } from '../data/products'
import type { Product } from '../data/products'

interface WishlistPageProps {
  wishlistedIds: number[]
  onNavigate: (page: string, productId?: number) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
}

export default function WishlistPage({ wishlistedIds, onNavigate, onAddToCart, onToggleWishlist }: WishlistPageProps) {
  const wishlisted = products.filter(p => wishlistedIds.includes(p.id))

  return (
    <div className="page-transition max-w-[1440px] mx-auto px-6 lg:px-12 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            My Wishlist
          </h1>
          {wishlisted.length > 0 && (
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{wishlisted.length} {wishlisted.length === 1 ? 'item' : 'items'}</p>
          )}
        </div>
        {wishlisted.length > 0 && (
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            <Share2 size={16} /> Share Wishlist
          </button>
        )}
      </div>

      {wishlisted.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--muted)' }}>
            <Heart size={40} style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <h2 className="text-xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Your wishlist is empty</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>Save items you love to come back to them later.</p>
          <button
            onClick={() => onNavigate('listing')}
            className="px-8 py-3.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Start Browsing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlisted.map(product => (
            <div
              key={product.id}
              className="rounded-2xl overflow-hidden group"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div
                className="relative aspect-square img-zoom cursor-pointer overflow-hidden"
                style={{ background: 'var(--muted)' }}
                onClick={() => onNavigate('product', product.id)}
              >
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                <button
                  onClick={e => { e.stopPropagation(); onToggleWishlist(product.id) }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                  style={{ background: 'white', border: 'none', cursor: 'pointer', color: '#EF4444' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{product.brand}</p>
                <h3
                  className="text-sm font-bold mb-2 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
                  onClick={() => onNavigate('product', product.id)}
                >
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-base font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>${product.price}</span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-85"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    <ShoppingBag size={12} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
