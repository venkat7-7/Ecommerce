import { Camera, Send, Play, ArrowRight } from 'lucide-react'

interface FooterProps {
  onNavigate: (page: string) => void
}

const footerLinks = {
  Shop: ['New Arrivals', 'Best Sellers', 'Sale', 'Footwear', 'Clothing', 'Accessories'],
  Support: ['FAQs', 'Shipping & Returns', 'Size Guide', 'Track Order', 'Contact Us'],
  Company: ['About APEX', 'Sustainability', 'Careers', 'Press', 'Affiliates'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-50">Stay in the loop</p>
              <h3
                className="text-3xl lg:text-4xl font-black tracking-tight mb-2"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Join the APEX circle.
              </h3>
              <p className="text-sm opacity-60">Early access, exclusive drops, and nothing you don't need.</p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3.5 rounded-xl text-sm font-medium outline-none"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              <button
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-85 whitespace-nowrap"
                style={{ background: 'white', color: '#111111', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-2xl font-black tracking-tighter mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>APEX</h4>
            <p className="text-sm opacity-50 leading-relaxed mb-6 max-w-[200px]">
              Premium goods for considered living. Crafted without compromise.
            </p>
            <div className="flex gap-3">
              {[Camera, Send, Play].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-60"
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', color: 'white' }}
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4 opacity-50">{section}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => onNavigate('home')}
                      className="text-sm opacity-70 hover:opacity-100 transition-opacity text-left"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontFamily: 'Inter, sans-serif' }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <p className="text-xs opacity-40">© 2026 APEX Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-3 opacity-40">
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
              <span key={method} className="text-xs font-medium px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
