import { useState, useEffect } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Play, Shield, Truck, RefreshCw, Star } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products, categories, reviews, instagramImages } from '../data/products'
import type { Product } from '../data/products'

interface HomePageProps {
  onNavigate: (page: string, productId?: number) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
  wishlistedIds: number[]
}

const heroSlides = [
  {
    eyebrow: 'Spring Collection 2026',
    headline: 'Crafted for the\nConsidered Life.',
    subline: 'Premium goods that earn their place. Designed to last, made to matter.',
    cta: 'Explore Collection',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1440&h=900&fit=crop&auto=format',
    accent: '#5B8DEF',
  },
  {
    eyebrow: 'New: Meridian Timepiece',
    headline: 'Time, Rendered\nWithout Excess.',
    subline: 'Swiss precision. Brushed titanium. A new language for the wrist.',
    cta: 'Shop Watches',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1440&h=900&fit=crop&auto=format',
    accent: '#C4A882',
  },
  {
    eyebrow: 'Limited Edition',
    headline: 'The Heritage\nWool Jacket.',
    subline: '100% Merino wool. Horn buttons. A piece you will still wear in twenty years.',
    cta: 'Shop Outerwear',
    image: 'https://images.unsplash.com/photo-1511401139252-f158d3209c17?w=1440&h=900&fit=crop&auto=format',
    accent: '#22C55E',
  },
]

function Countdown() {
  const [time, setTime] = useState({ h: 7, m: 23, s: 41 })
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s--
        if (s < 0) { s = 59; m-- }
        if (m < 0) { m = 59; h-- }
        if (h < 0) { h = 0; m = 0; s = 0 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="flex items-center gap-2">
      {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
        <span key={i} className="flex items-center gap-2">
          <span
            className="w-12 h-12 flex items-center justify-center rounded-xl text-lg font-black text-white"
            style={{ background: 'rgba(255,255,255,0.15)', fontFamily: 'Manrope, sans-serif' }}
          >
            {unit}
          </span>
          {i < 2 && <span className="text-white font-bold opacity-60">:</span>}
        </span>
      ))}
    </div>
  )
}

export default function HomePage({ onNavigate, onAddToCart, onToggleWishlist, wishlistedIds }: HomePageProps) {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [])

  const current = heroSlides[slide]
  const featuredProducts = products.slice(0, 4)
  const bestSellers = products.slice(1, 5)
  const newArrivals = products.filter(p => p.badge === 'New')
  const saleProducts = products.filter(p => p.badge === 'Sale')

  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
        <img
          src={current.image}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />

        <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col justify-center">
          <div className="max-w-xl">
            <p
              className="text-xs font-semibold uppercase tracking-widest text-white opacity-70 mb-5 fade-in-up"
              style={{ animationDelay: '0ms' }}
            >
              {current.eyebrow}
            </p>
            <h1
              className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6 fade-in-up whitespace-pre-line"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', animationDelay: '80ms' }}
            >
              {current.headline}
            </h1>
            <p className="text-base lg:text-lg text-white opacity-70 mb-10 leading-relaxed fade-in-up" style={{ animationDelay: '160ms' }}>
              {current.subline}
            </p>
            <div className="flex items-center gap-4 fade-in-up" style={{ animationDelay: '240ms' }}>
              <button
                onClick={() => onNavigate('listing')}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 hover:-translate-y-0.5"
                style={{ background: 'white', color: '#111111', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transform: 'translateY(0)' }}
              >
                {current.cta} <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('listing')}
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-70"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(10px)' }}
              >
                <Play size={14} fill="white" /> Watch Film
              </button>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <button
            onClick={() => setSlide(s => (s - 1 + heroSlides.length) % heroSlides.length)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-70 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{ width: i === slide ? '32px' : '8px', background: i === slide ? 'white' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer' }}
              />
            ))}
          </div>
          <button
            onClick={() => setSlide(s => (s + 1) % heroSlides.length)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-70 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Slide number */}
        <div className="absolute bottom-10 right-8 text-white opacity-40 text-sm font-mono">
          {String(slide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x" style={{ borderColor: 'var(--border)' }}>
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders over $150' },
              { icon: RefreshCw, label: '30-Day Returns', sub: 'No questions asked' },
              { icon: Shield, label: 'Secure Payment', sub: 'SSL encrypted checkout' },
              { icon: Star, label: '4.9 Rating', sub: 'From 50k+ reviews' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 px-6 lg:px-10 py-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--muted)' }}
                >
                  <Icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Browse by</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('listing')}
            className="hidden md:flex items-center gap-2 text-sm font-semibold hover:opacity-60 transition-opacity"
            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onNavigate('listing')}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group card-hover text-left"
              style={{ background: 'var(--muted)', border: 'none', cursor: 'pointer' }}
            >
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-lg font-black text-white mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>{cat.name}</h3>
                <p className="text-sm text-white opacity-70">{cat.count} products</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Handpicked for you</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              Featured Products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('listing')}
            className="hidden md:flex items-center gap-2 text-sm font-semibold hover:opacity-60 transition-opacity"
            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map(p => (
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
      </section>

      {/* Promo Banner */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #111111 0%, #1a1a2e 100%)', minHeight: '320px' }}
        >
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1440&h=600&fit=crop&auto=format"
              alt="Promo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 lg:p-16 gap-8">
            <div>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 text-white"
                style={{ background: 'rgba(91,141,239,0.3)', border: '1px solid rgba(91,141,239,0.5)' }}
              >
                Members Only
              </span>
              <h2
                className="text-4xl lg:text-5xl font-black text-white mb-3 leading-tight"
                style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.02em' }}
              >
                Get 20% off your<br />first order.
              </h2>
              <p className="text-white opacity-60 text-base max-w-sm">
                Join the APEX circle and unlock member-exclusive pricing, early drops, and free returns.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => onNavigate('auth')}
                className="px-8 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 hover:-translate-y-0.5 whitespace-nowrap"
                style={{ background: 'white', color: '#111111', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Create Free Account
              </button>
              <p className="text-xs text-white opacity-40">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-12" style={{ background: 'var(--accent)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white opacity-70 mb-2">Limited time</p>
              <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Flash Sale — ends in
              </h2>
            </div>
            <Countdown />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {saleProducts.concat(saleProducts).slice(0, 4).map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                onClick={() => onNavigate('product', p.id)}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <div className="aspect-square img-zoom overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-white opacity-70 mb-1">{p.brand}</p>
                  <p className="text-sm font-semibold text-white mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>{p.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">${p.price}</span>
                    {p.originalPrice && (
                      <span className="text-sm line-through text-white opacity-50">${p.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Community favorites</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              Best Sellers
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellers.map(p => (
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
      </section>

      {/* Split editorial */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 mb-10">
        <div className="grid lg:grid-cols-2 gap-5">
          <div
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ minHeight: '400px', background: '#0A0A0A' }}
            onClick={() => onNavigate('listing')}
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=800&fit=crop&auto=format"
              alt="New Season"
              className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <span className="text-xs font-semibold uppercase tracking-widest text-white opacity-60 mb-2">2026 Collection</span>
              <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>New Season,<br />New Standards.</h3>
              <button
                className="self-start flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(10px)' }}
              >
                Shop Women <ArrowRight size={14} />
              </button>
            </div>
          </div>
          <div
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ minHeight: '400px', background: '#F5F0EB' }}
            onClick={() => onNavigate('listing')}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format"
              alt="Men"
              className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <span className="text-xs font-semibold uppercase tracking-widest text-white opacity-60 mb-2">Men's Edit</span>
              <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Quiet Luxury,<br />Loud Quality.</h3>
              <button
                className="self-start flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(10px)' }}
              >
                Shop Men <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>Just dropped</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              New Arrivals
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {newArrivals.concat(products.slice(5, 7)).slice(0, 4).map(p => (
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
      </section>

      {/* Reviews */}
      <section className="py-20" style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>What people say</p>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              50,000+ happy customers
            </h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
              <span className="ml-2 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>4.9 / 5.0</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div
                key={review.id}
                className="p-6 rounded-2xl card-hover"
                style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--foreground)' }}>"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{review.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{review.product} · {review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand logos */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: 'var(--muted-foreground)' }}>
          As seen in
        </p>
        <div className="flex items-center justify-center flex-wrap gap-8 lg:gap-16">
          {['Vogue', 'GQ', 'Hypebeast', 'Highsnobiety', 'Wallpaper*', 'Dezeen'].map(brand => (
            <span key={brand} className="text-lg font-black tracking-tight opacity-20 hover:opacity-50 transition-opacity cursor-default" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Instagram Grid */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 mb-10">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>@apexstore</p>
          <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
            Shop the feed
          </h2>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {instagramImages.map((img, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden img-zoom cursor-pointer">
              <img src={img} alt={`Instagram ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
