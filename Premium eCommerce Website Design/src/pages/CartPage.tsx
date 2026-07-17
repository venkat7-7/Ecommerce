import { Minus, Plus, X, Truck, Tag, ArrowRight, ShoppingBag } from 'lucide-react'
import { products } from '../data/products'
import type { Product } from '../data/products'
import ProductCard from '../components/ProductCard'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface CartPageProps {
  cartItems: CartItem[]
  onNavigate: (page: string, productId?: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemoveItem: (productId: number) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
  wishlistedIds: number[]
}

export default function CartPage({ cartItems, onNavigate, onUpdateQuantity, onRemoveItem, onAddToCart, onToggleWishlist, wishlistedIds }: CartPageProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 12
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax
  const recommendations = products.filter(p => !cartItems.some(c => c.product.id === p.id)).slice(0, 4)

  return (
    <div className="page-transition max-w-[1440px] mx-auto px-6 lg:px-12 py-10 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl lg:text-3xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
          Shopping Cart
          {cartItems.length > 0 && <span className="ml-2 text-base font-normal" style={{ color: 'var(--muted-foreground)' }}>({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>}
        </h1>
        <button
          onClick={() => onNavigate('listing')}
          className="flex items-center gap-2 text-sm font-medium hover:opacity-60 transition-opacity"
          style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--muted)' }}>
            <ShoppingBag size={40} style={{ color: 'var(--muted-foreground)' }} />
          </div>
          <h2 className="text-xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Your cart is empty</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>Looks like you haven't added anything yet.</p>
          <button
            onClick={() => onNavigate('listing')}
            className="px-8 py-3.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free shipping banner */}
            {shipping > 0 && (
              <div
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'rgba(91,141,239,0.08)', border: '1px solid rgba(91,141,239,0.2)' }}
              >
                <Truck size={18} style={{ color: 'var(--accent)' }} />
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                  Add <strong>${(150 - subtotal).toFixed(0)}</strong> more to get free shipping!
                </p>
              </div>
            )}

            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-5 p-5 rounded-2xl"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer img-zoom"
                  style={{ background: 'var(--muted)' }}
                  onClick={() => onNavigate('product', product.id)}
                >
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{product.brand}</p>
                      <h3
                        className="text-sm font-bold cursor-pointer hover:opacity-70 transition-opacity"
                        style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
                        onClick={() => onNavigate('product', product.id)}
                      >
                        {product.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="hover:opacity-60 transition-opacity flex-shrink-0"
                      style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                    <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid var(--border)', width: 'fit-content' }}>
                      <button
                        onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center hover:opacity-60 transition-opacity"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold" style={{ color: 'var(--foreground)' }}>{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:opacity-60 transition-opacity"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {product.originalPrice && (
                        <span className="text-sm line-through" style={{ color: 'var(--muted-foreground)' }}>${product.originalPrice}</span>
                      )}
                      <span className="text-base font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupon */}
            <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Have a coupon?</p>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter code (e.g. APEX20)"
                  className="input-field flex-1 px-4 py-3 rounded-xl text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  className="px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-85"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h2 className="text-lg font-black mb-5" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                  <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#22C55E' : 'var(--foreground)', fontWeight: 600 }}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>Tax (8%)</span>
                  <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 mb-6" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>Total</span>
                <span className="text-2xl font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 mb-3"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
                Secure checkout · SSL encrypted
              </p>

              {/* Payment icons */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {['Visa', 'MC', 'Amex', 'PayPal'].map(m => (
                  <span key={m} className="text-xs font-semibold px-2 py-1 rounded" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-black tracking-tight mb-8" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            You might also like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map(p => (
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
    </div>
  )
}
