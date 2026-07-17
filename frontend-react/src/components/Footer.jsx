import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Send, Play, ArrowRight } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', path: '/products' },
    { label: 'Best Sellers', path: '/products' },
    { label: 'Sale', path: '/products' },
    { label: 'Footwear', path: '/products?category=Footwear' },
    { label: 'Clothing', path: '/products?category=Clothing' },
    { label: 'Accessories', path: '/products?category=Accessories' }
  ],
  Support: [
    { label: 'FAQs', path: '/' },
    { label: 'Shipping & Returns', path: '/' },
    { label: 'Size Guide', path: '/' },
    { label: 'Track Order', path: '/orders' },
    { label: 'Contact Us', path: '/' }
  ],
  Company: [
    { label: 'About ShopEasy', path: '/' },
    { label: 'Sustainability', path: '/' },
    { label: 'Careers', path: '/' },
    { label: 'Press', path: '/' },
    { label: 'Affiliates', path: '/' }
  ],
  Legal: [
    { label: 'Privacy Policy', path: '/' },
    { label: 'Terms of Service', path: '/' },
    { label: 'Cookie Policy', path: '/' },
    { label: 'Accessibility', path: '/' }
  ],
};

export default function Footer() {
  return (
    <footer 
      className="border-t"
      style={{ 
        background: 'var(--card)', 
        color: 'var(--foreground)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Stay in the loop</p>
              <h3
                className="text-3xl lg:text-4xl font-black tracking-tight mb-2"
                style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
              >
                Join the ShopEasy circle.
              </h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Early access, exclusive drops, and nothing you don't need.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3.5 rounded-xl text-sm font-medium outline-none input-field"
              />
              <button
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition-all hover:opacity-85 whitespace-nowrap btn-primary border-none"
              >
                Subscribe <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 text-left">
            <h4 className="text-2xl font-black tracking-tighter mb-4" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              ShopEasy
            </h4>
            <p className="text-xs leading-relaxed mb-6 max-w-[200px]" style={{ color: 'var(--muted-foreground)' }}>
              Premium goods for considered living. Crafted without compromise.
            </p>
            <div className="flex gap-3">
              {[Camera, Send, Play].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80 border"
                  style={{ 
                    background: 'var(--muted)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--foreground)',
                    cursor: 'pointer'
                  }}
                  aria-label="Social link"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color: 'var(--foreground)' }}>
                {section}
              </p>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-xs transition-opacity hover:opacity-75 no-underline block"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        color: 'var(--muted-foreground)'
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div 
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" 
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            © {new Date().getFullYear()} ShopEasy Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
              <span 
                key={method} 
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase" 
                style={{ 
                  background: 'var(--muted)', 
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
