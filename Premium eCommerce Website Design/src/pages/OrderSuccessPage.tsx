import { useState, useEffect } from 'react'
import { CheckCircle, Package, MapPin, ArrowRight, Copy, Check } from 'lucide-react'

interface OrderSuccessProps {
  onNavigate: (page: string) => void
}

export default function OrderSuccessPage({ onNavigate }: OrderSuccessProps) {
  const [copied, setCopied] = useState(false)
  const [animDone, setAnimDone] = useState(false)
  const orderNumber = 'APX-2026-78341'
  const estimatedDelivery = 'March 22–24, 2026'

  useEffect(() => {
    const t = setTimeout(() => setAnimDone(true), 800)
    return () => clearTimeout(t)
  }, [])

  const copyOrder = () => {
    navigator.clipboard.writeText(orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page-transition min-h-screen flex items-center justify-center px-6 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-lg w-full text-center">
        {/* Animated check */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div
            className="absolute inset-0 rounded-full transition-all duration-700"
            style={{
              background: animDone ? 'rgba(34,197,94,0.12)' : 'transparent',
              transform: animDone ? 'scale(1)' : 'scale(0)',
            }}
          />
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              background: animDone ? '#22C55E' : 'var(--muted)',
              transform: animDone ? 'scale(1) rotate(0)' : 'scale(0.5) rotate(-90deg)',
            }}
          >
            <CheckCircle size={48} color="white" fill="white" style={{ color: '#22C55E' }} />
          </div>
        </div>

        <div
          className="transition-all duration-500"
          style={{ opacity: animDone ? 1 : 0, transform: animDone ? 'translateY(0)' : 'translateY(16px)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#22C55E' }}>Order Confirmed</p>
          <h1 className="text-3xl lg:text-4xl font-black mb-3" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            Thank you, James!
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Your order has been placed and is being prepared. A confirmation email has been sent to{' '}
            <strong style={{ color: 'var(--foreground)' }}>james@example.com</strong>
          </p>

          {/* Order number */}
          <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Order Details</h3>
              <button
                onClick={copyOrder}
                className="flex items-center gap-1.5 text-xs font-medium hover:opacity-60 transition-opacity"
                style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>Order Number</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'monospace', color: 'var(--foreground)' }}>{orderNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>Estimated Delivery</p>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{estimatedDelivery}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>Payment</p>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Visa •••• 4242</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--muted-foreground)' }}>Total</p>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>$421.36</p>
              </div>
            </div>
          </div>

          {/* Tracking steps */}
          <div className="rounded-2xl p-5 mb-8 text-left" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--foreground)' }}>What happens next?</h3>
            <div className="space-y-4">
              {[
                { icon: CheckCircle, label: 'Order Confirmed', sub: 'Today, March 18', done: true },
                { icon: Package, label: 'Preparing Your Order', sub: 'March 18–19', done: false },
                { icon: Package, label: 'Shipped', sub: 'March 19–20', done: false },
                { icon: MapPin, label: 'Delivered', sub: estimatedDelivery, done: false },
              ].map(({ icon: Icon, label, sub, done }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: done ? '#22C55E' : 'var(--muted)', color: done ? 'white' : 'var(--muted-foreground)' }}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: done ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('account')}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Track Order <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 py-4 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
