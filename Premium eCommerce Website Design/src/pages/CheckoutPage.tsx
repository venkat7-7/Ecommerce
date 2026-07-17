import { useState } from 'react'
import { Shield, ChevronRight, CreditCard, Smartphone, Building, Lock, Check } from 'lucide-react'
import type { CartItem } from './CartPage'

interface CheckoutPageProps {
  cartItems: CartItem[]
  onNavigate: (page: string) => void
}

const steps = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage({ cartItems, onNavigate }: CheckoutPageProps) {
  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'US',
    cardNumber: '', expiry: '', cvv: '', cardName: '',
  })

  const subtotal = cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
  const shipping = subtotal >= 150 ? 0 : 12
  const tax = Math.round(subtotal * 0.08 * 100) / 100
  const total = subtotal + shipping + tax

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const InputField = ({ label, id, placeholder, type = 'text', half = false }: { label: string; id: keyof typeof form; placeholder: string; type?: string; half?: boolean }) => (
    <div className={half ? '' : 'col-span-2'}>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
      <input
        type={type}
        value={form[id]}
        onChange={e => update(id, e.target.value)}
        placeholder={placeholder}
        className="input-field w-full px-4 py-3 rounded-xl text-sm"
        style={{ fontFamily: 'Inter, sans-serif' }}
      />
    </div>
  )

  return (
    <div className="page-transition min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <button onClick={() => onNavigate('home')} className="text-2xl font-black tracking-tighter mb-6 block mx-auto" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}>
            APEX
          </button>

          {/* Progress */}
          <div className="flex items-center justify-center gap-0">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all"
                    style={{
                      background: i < step ? '#22C55E' : i === step ? 'var(--primary)' : 'var(--muted)',
                      color: i <= step ? 'white' : 'var(--muted-foreground)',
                    }}
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </div>
                  <span className="text-xs font-medium" style={{ color: i === step ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-20 h-0.5 mb-5 mx-2" style={{ background: i < step ? '#22C55E' : 'var(--border)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 0 && (
              <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h2 className="text-lg font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="First Name" id="firstName" placeholder="James" half />
                  <InputField label="Last Name" id="lastName" placeholder="Wilson" half />
                  <InputField label="Email Address" id="email" placeholder="james@example.com" type="email" />
                  <InputField label="Phone Number" id="phone" placeholder="+1 (555) 000-0000" type="tel" />
                  <InputField label="Street Address" id="address" placeholder="123 Main Street, Apt 4B" />
                  <InputField label="City" id="city" placeholder="New York" half />
                  <InputField label="State / Province" id="state" placeholder="NY" half />
                  <InputField label="ZIP / Postal Code" id="zip" placeholder="10001" half />
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Country</label>
                    <select
                      className="input-field w-full px-4 py-3 rounded-xl text-sm"
                      value={form.country}
                      onChange={e => update('country', e.target.value)}
                      style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)', background: 'var(--card)' }}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold mt-6 transition-all hover:opacity-85"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  Continue to Payment <ChevronRight size={16} />
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h2 className="text-lg font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Payment Method</h2>

                  {/* Method selector */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'card', Icon: CreditCard, label: 'Card' },
                      { id: 'apple', Icon: Smartphone, label: 'Apple Pay' },
                      { id: 'bank', Icon: Building, label: 'Bank Transfer' },
                    ].map(({ id, Icon, label }) => (
                      <button
                        key={id}
                        onClick={() => setPaymentMethod(id)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:opacity-80"
                        style={{
                          border: paymentMethod === id ? '2px solid var(--accent)' : '2px solid var(--border)',
                          background: paymentMethod === id ? 'rgba(91,141,239,0.05)' : 'transparent',
                          cursor: 'pointer',
                          color: paymentMethod === id ? 'var(--accent)' : 'var(--foreground)',
                        }}
                      >
                        <Icon size={22} />
                        <span className="text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={form.cardNumber}
                            onChange={e => update('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="input-field w-full pl-4 pr-12 py-3 rounded-xl text-sm"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                          <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Cardholder Name</label>
                        <input
                          type="text"
                          value={form.cardName}
                          onChange={e => update('cardName', e.target.value)}
                          placeholder="James Wilson"
                          className="input-field w-full px-4 py-3 rounded-xl text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Expiry Date</label>
                        <input
                          type="text"
                          value={form.expiry}
                          onChange={e => update('expiry', e.target.value)}
                          placeholder="MM / YY"
                          maxLength={7}
                          className="input-field w-full px-4 py-3 rounded-xl text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>CVV</label>
                        <input
                          type="text"
                          value={form.cvv}
                          onChange={e => update('cvv', e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          className="input-field w-full px-4 py-3 rounded-xl text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'apple' && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--muted)' }}>
                        <Smartphone size={32} style={{ color: 'var(--foreground)' }} />
                      </div>
                      <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Authenticate with Face ID or Touch ID to pay</p>
                    </div>
                  )}
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 p-4">
                  <div className="flex items-center gap-2">
                    <Lock size={14} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={14} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Buyer Protected</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-4 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
                    style={{ border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    Review Order <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h2 className="text-lg font-black mb-4" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Review Your Order</h2>
                  <div className="space-y-4">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--muted)' }}>
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{product.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Qty: {quantity}</p>
                        </div>
                        <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>${(product.price * quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
                    style={{ border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => onNavigate('success')}
                    className="flex-[2] py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85"
                    style={{ background: '#22C55E', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    Place Order · ${total.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div>
            <div className="rounded-2xl p-5 sticky top-24" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--foreground)' }}>Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--muted)' }}>
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--foreground)' }}>{product.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>×{quantity}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>${product.price * quantity}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                  <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--muted-foreground)' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#22C55E' : 'var(--foreground)', fontWeight: 600 }}>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--muted-foreground)' }}>Tax</span>
                  <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Total</span>
                  <span className="text-lg font-black" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
