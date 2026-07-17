import { useState } from 'react'
import { Package, Heart, MapPin, CreditCard, Bell, Settings, LogOut, ChevronRight } from 'lucide-react'

interface AccountPageProps {
  onNavigate: (page: string) => void
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Settings },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

const mockOrders = [
  { id: 'APX-2026-78341', date: 'March 18, 2026', status: 'Processing', items: 2, total: 421.36, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop&auto=format' },
  { id: 'APX-2026-67210', date: 'February 28, 2026', status: 'Delivered', items: 1, total: 310.00, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop&auto=format' },
  { id: 'APX-2026-54891', date: 'January 15, 2026', status: 'Delivered', items: 3, total: 849.00, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop&auto=format' },
]

const statusColor: Record<string, string> = {
  Processing: '#F59E0B',
  Shipped: '#5B8DEF',
  Delivered: '#22C55E',
  Cancelled: '#EF4444',
}

export default function AccountPage({ onNavigate }: AccountPageProps) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifs, setNotifs] = useState({ orders: true, promos: false, reviews: true, newArrivals: true })

  return (
    <div className="page-transition max-w-[1440px] mx-auto px-6 lg:px-12 py-10 min-h-screen">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside>
          {/* Profile card */}
          <div className="rounded-2xl p-5 mb-4 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-3"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--primary))' }}
            >
              J
            </div>
            <h3 className="text-base font-black mb-0.5" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>James Wilson</h3>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Member since Jan 2025</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#22C55E' }} />
              <span className="text-xs font-medium" style={{ color: '#22C55E' }}>APEX Gold Member</span>
            </div>
          </div>

          {/* Nav */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-all hover:opacity-70"
                style={{
                  background: activeTab === id ? 'var(--muted)' : 'transparent',
                  color: activeTab === id ? 'var(--foreground)' : 'var(--muted-foreground)',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'left',
                  fontWeight: activeTab === id ? 600 : 400,
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} style={{ color: activeTab === id ? 'var(--accent)' : 'inherit' }} />
                  {label}
                </div>
                <ChevronRight size={14} />
              </button>
            ))}
            <button
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all hover:opacity-70"
              style={{ background: 'transparent', color: '#EF4444', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left' }}
              onClick={() => onNavigate('auth')}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3">
          {activeTab === 'dashboard' && (
            <div className="fade-in-up">
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Dashboard</h2>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Orders', value: '14' },
                  { label: 'Total Spent', value: '$4,280' },
                  { label: 'Wishlist Items', value: '7' },
                  { label: 'Reviews Left', value: '5' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <p className="text-2xl font-black mb-1" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>{value}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Recent order */}
              <h3 className="text-base font-bold mb-4" style={{ color: 'var(--foreground)' }}>Recent Order</h3>
              {mockOrders.slice(0, 1).map(order => (
                <div key={order.id} className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)', fontFamily: 'monospace' }}>{order.id}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{order.date}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${statusColor[order.status]}20`, color: statusColor[order.status] }}>
                      {order.status}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('account')}
                    className="text-sm font-medium hover:opacity-60 transition-opacity"
                    style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Track order →
                  </button>
                </div>
              ))}

              {/* Profile settings quick edit */}
              <h3 className="text-base font-bold mt-8 mb-4" style={{ color: 'var(--foreground)' }}>Profile Settings</h3>
              <div className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: 'First Name', value: 'James' },
                    { label: 'Last Name', value: 'Wilson' },
                    { label: 'Email', value: 'james@example.com' },
                    { label: 'Phone', value: '+1 (555) 012-3456' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
                      <input
                        defaultValue={value}
                        className="input-field w-full px-4 py-3 rounded-xl text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                  ))}
                </div>
                <button
                  className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-85"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="fade-in-up">
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Order History</h2>
              <div className="space-y-4">
                {mockOrders.map(order => (
                  <div key={order.id} className="p-5 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--muted)' }}>
                          <img src={order.image} alt="Order" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--foreground)', fontFamily: 'monospace' }}>{order.id}</p>
                          <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{order.date} · {order.items} {order.items === 1 ? 'item' : 'items'}</p>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: `${statusColor[order.status]}20`, color: statusColor[order.status] }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>${order.total.toFixed(2)}</p>
                        <button
                          className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{ background: 'var(--muted)', color: 'var(--foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="fade-in-up">
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Notifications</h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                {Object.entries(notifs).map(([key, value], i) => {
                  const labels: Record<string, { title: string; sub: string }> = {
                    orders: { title: 'Order Updates', sub: 'Shipping, delivery, and return notifications' },
                    promos: { title: 'Promotions & Sales', sub: 'Flash sales, coupons, and special offers' },
                    reviews: { title: 'Review Reminders', sub: 'Prompts to review recent purchases' },
                    newArrivals: { title: 'New Arrivals', sub: 'Be first to know about new products' },
                  }
                  const { title, sub } = labels[key]
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-5"
                      style={{ borderBottom: i < Object.keys(notifs).length - 1 ? '1px solid var(--border)' : 'none' }}
                    >
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{title}</p>
                        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>
                      </div>
                      <button
                        onClick={() => setNotifs(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                        style={{ background: value ? 'var(--accent)' : 'var(--muted)', border: 'none', cursor: 'pointer' }}
                      >
                        <div
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300"
                          style={{ left: value ? '26px' : '2px' }}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {(activeTab === 'wishlist' || activeTab === 'addresses' || activeTab === 'payment') && (
            <div className="fade-in-up">
              <h2 className="text-2xl font-black mb-6 capitalize" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <p className="text-4xl mb-3">
                  {activeTab === 'wishlist' ? '♡' : activeTab === 'addresses' ? '📍' : '💳'}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {activeTab === 'wishlist' ? 'Your wishlist is empty. ' : activeTab === 'addresses' ? 'No saved addresses yet. ' : 'No payment methods saved. '}
                  <button
                    onClick={() => onNavigate(activeTab === 'wishlist' ? 'wishlist' : 'home')}
                    style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                  >
                    {activeTab === 'wishlist' ? 'Browse products' : activeTab === 'addresses' ? 'Add address' : 'Add payment method'}
                  </button>
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
