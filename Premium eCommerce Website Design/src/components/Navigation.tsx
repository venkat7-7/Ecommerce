import { useState, useEffect } from 'react'
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon, ChevronDown } from 'lucide-react'

interface NavigationProps {
  onNavigate: (page: string) => void
  cartCount: number
  wishlistCount: number
  darkMode: boolean
  onToggleDark: () => void
}

const navLinks = [
  {
    label: 'New In',
    page: 'listing',
    mega: [
      { title: 'New Arrivals', items: ['This Week', 'Best Sellers', 'Trending Now'] },
      { title: 'By Category', items: ['Footwear', 'Clothing', 'Accessories', 'Bags'] },
    ],
  },
  {
    label: 'Collections',
    page: 'listing',
    mega: [
      { title: 'Season', items: ['Spring 2026', 'Limited Edition', 'Archive'] },
      { title: 'Brands', items: ['VELO', 'ARTIS', 'FORMA', 'HORA'] },
    ],
  },
  { label: 'Footwear', page: 'listing' },
  { label: 'Clothing', page: 'listing' },
  { label: 'Accessories', page: 'listing' },
  { label: 'Sale', page: 'listing' },
]

export default function Navigation({ onNavigate, cartCount, wishlistCount, darkMode, onToggleDark }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="text-center py-2 text-xs font-medium tracking-widest uppercase"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        Free shipping on orders over $150 · New arrivals weekly
      </div>

      {/* Main Nav */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? darkMode
              ? 'rgba(10,10,10,0.85)'
              : 'rgba(250,250,250,0.85)'
            : 'var(--background)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: `1px solid var(--border)`,
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="text-xl font-black tracking-tighter"
              style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              APEX
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.mega && setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="flex items-center gap-1 text-sm font-medium py-4 hover:opacity-60 transition-opacity"
                    style={{
                      color: link.label === 'Sale' ? '#EF4444' : 'var(--foreground)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {link.label}
                    {link.mega && <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: hoveredLink === link.label ? 'rotate(180deg)' : 'rotate(0)' }} />}
                  </button>

                  {/* Mega Menu */}
                  {link.mega && hoveredLink === link.label && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-80 p-6 rounded-2xl shadow-2xl z-50"
                      style={{
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        marginTop: '-1px',
                      }}
                    >
                      <div className="grid grid-cols-2 gap-6">
                        {link.mega.map((section) => (
                          <div key={section.title}>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>{section.title}</p>
                            <ul className="space-y-2">
                              {section.items.map((item) => (
                                <li key={item}>
                                  <button
                                    onClick={() => onNavigate('listing')}
                                    className="text-sm hover:opacity-60 transition-opacity text-left w-full"
                                    style={{ color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                                  >
                                    {item}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity"
                style={{ color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <button
                onClick={onToggleDark}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity"
                style={{ color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => onNavigate('wishlist')}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity"
                style={{ color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onNavigate('account')}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity"
                style={{ color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Account"
              >
                <User size={18} />
              </button>

              <button
                onClick={() => onNavigate('cart')}
                className="relative flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-semibold hover:opacity-85 transition-opacity"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                aria-label="Cart"
              >
                <ShoppingBag size={16} />
                <span className="hidden sm:inline">{cartCount}</span>
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center sm:hidden"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t"
            style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
          >
            <div className="max-w-[1440px] mx-auto px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { onNavigate(link.page); setMobileOpen(false) }}
                  className="block w-full text-left py-3 text-sm font-medium border-b"
                  style={{
                    color: link.label === 'Sale' ? '#EF4444' : 'var(--foreground)',
                    borderColor: 'var(--border)',
                    background: 'none',
                    border: 'none',
                    borderBottom: `1px solid var(--border)`,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-2xl fade-in-up">
            <div
              className="rounded-2xl p-6 shadow-2xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Search size={20} style={{ color: 'var(--muted-foreground)' }} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { onNavigate('search'); setSearchOpen(false) } }}
                  placeholder="Search for products, brands, categories..."
                  className="input-field flex-1 text-base bg-transparent"
                  style={{ border: 'none', boxShadow: 'none', fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Minimal Sneaker', 'Wool Jacket', 'Leather Tote', 'Swiss Watch', 'Linen Set'].map((term) => (
                    <button
                      key={term}
                      onClick={() => { onNavigate('search'); setSearchOpen(false) }}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-80"
                      style={{ background: 'var(--muted)', color: 'var(--foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
