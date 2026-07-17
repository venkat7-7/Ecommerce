import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Truck, RefreshCw, Star } from 'lucide-react';
import { apiFetch, showToast, getToken } from '../api';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';

const heroSlides = [
  {
    eyebrow: 'Exclusive Launch 2026',
    headline: 'Crafted for the\nModern Lifestyle.',
    subline: 'Premium goods that earn their place. Designed to last, made to matter.',
    cta: 'Explore Collection',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1440&h=900&fit=crop&auto=format',
  },
  {
    eyebrow: 'New Arrivals: Smart Gear',
    headline: 'Precision Tech,\nWithout Excess.',
    subline: 'Tactile responses. Beautiful layouts. A new standard for your work setup.',
    cta: 'Shop Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1440&h=900&fit=crop&auto=format',
  },
  {
    eyebrow: 'Limited Edition Denim',
    headline: 'Classic Wear,\nRe-imagined.',
    subline: '100% premium quality threads. Built to last for generations to come.',
    cta: 'Shop Clothing',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=1440&h=900&fit=crop&auto=format',
  },
];

const categoryImages = {
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop',
  Clothing: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop',
  Grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=800&fit=crop',
};

const editorialImages = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format',
];

const instagramImages = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&fit=crop',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&fit=crop',
  'https://images.unsplash.com/photo-1572635196233-14b250f48721?w=400&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&fit=crop',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&fit=crop',
];

const reviews = [
  {
    id: 1,
    rating: 5,
    text: 'Exceptional quality and fast delivery. The product exceeded my expectations in every way.',
    name: 'Priya Sharma',
    product: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
  },
  {
    id: 2,
    rating: 5,
    text: 'Beautiful packaging, premium feel, and the customer support team was incredibly helpful.',
    name: 'Arjun Mehta',
    product: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
  },
  {
    id: 3,
    rating: 5,
    text: 'ShopEasy has become my go-to for quality products. The UI makes shopping a pleasure.',
    name: 'Sneha Reddy',
    product: 'Verified Buyer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
  },
];

function Countdown() {
  const [time, setTime] = useState({ h: 7, m: 23, s: 41 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

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
  );
}

function SectionHeader({ eyebrow, title, linkTo, linkLabel = 'View All' }) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
          {eyebrow}
        </p>
        <h2 className="text-3xl lg:text-4xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden md:flex items-center gap-2 text-sm font-semibold hover:opacity-60 transition-opacity no-underline"
          style={{ color: 'var(--accent)' }}
        >
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [categories, setCategories] = useState(['Electronics', 'Clothing', 'Grocery']);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const catData = await apiFetch('/api/products/categories');
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }

      setLoadingProducts(true);
      try {
        const prodData = await apiFetch('/api/products');
        if (Array.isArray(prodData)) {
          setProducts(prodData);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoadingProducts(false);
      }

      if (getToken()) {
        try {
          const wishData = await apiFetch('/api/wishlist');
          if (Array.isArray(wishData)) {
            setWishlistIds(new Set(wishData.map((item) => item.product_id)));
          }
        } catch (err) {
          console.error('Failed to load wishlist status:', err);
        }
      }
    };

    loadHomeData();
  }, []);

  const handleAddToCart = async (product) => {
    if (!getToken()) {
      showToast('Login required to add items to cart!', 'error');
      navigate('/login');
      return;
    }
    try {
      await apiFetch('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
      showToast(`${product.name} added to cart!`, 'success');
      window.dispatchEvent(new Event('update-cart-badge'));
    } catch (err) {
      showToast('Could not add to cart: ' + err.message, 'error');
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!getToken()) {
      showToast('Login required to save items!', 'error');
      navigate('/login');
      return;
    }
    const isCurrentlyWishlisted = wishlistIds.has(productId);
    try {
      if (isCurrentlyWishlisted) {
        await apiFetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        showToast('Removed from wishlist!', 'success');
      } else {
        await apiFetch('/api/wishlist', {
          method: 'POST',
          body: JSON.stringify({ product_id: productId }),
        });
        setWishlistIds((prev) => new Set(prev).add(productId));
        showToast('Saved to wishlist!', 'success');
      }
      window.dispatchEvent(new Event('update-cart-badge'));
    } catch (e) {
      showToast('Wishlist operation failed: ' + e.message, 'error');
    }
  };

  const featuredProducts = products.slice(0, 4);
  const bestSellers = products.slice(1, 5);
  const newArrivals = products.slice(4, 8);
  const saleProducts = products.filter((_, i) => i % 2 === 0).slice(0, 4);
  const current = heroSlides[slide];

  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[600px] overflow-hidden">
        {heroSlides.map((s, idx) => (
          <img
            key={idx}
            src={s.image}
            alt="Hero"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
              idx === slide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
        />

        <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col justify-center">
          <div className="max-w-xl text-left" key={slide}>
            <p className="text-xs font-semibold uppercase tracking-widest text-white opacity-70 mb-5 fade-in-up">
              {current.eyebrow}
            </p>
            <h1
              className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6 fade-in-up whitespace-pre-line"
              style={{ fontFamily: 'Manrope, sans-serif', letterSpacing: '-0.03em', animationDelay: '80ms' }}
            >
              {current.headline}
            </h1>
            <p
              className="text-base lg:text-lg text-white opacity-70 mb-10 leading-relaxed fade-in-up"
              style={{ animationDelay: '160ms' }}
            >
              {current.subline}
            </p>
            <div className="flex items-center gap-4 fade-in-up" style={{ animationDelay: '240ms' }}>
              <Link
                to="/products"
                className="flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 hover:-translate-y-0.5 no-underline"
                style={{ background: 'white', color: '#111111' }}
              >
                {current.cta} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10">
          <button
            onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-70 transition-opacity border-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className="h-1 rounded-full transition-all duration-300 border-none cursor-pointer"
                style={{
                  width: i === slide ? '32px' : '8px',
                  background: i === slide ? 'white' : 'rgba(255,255,255,0.4)',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-70 transition-opacity border-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="absolute bottom-10 right-8 text-white opacity-40 text-sm font-mono z-10">
          {String(slide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </div>
      </section>

      {/* Trust bar */}
      <section style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x" style={{ borderColor: 'var(--border)' }}>
            {[
              { icon: Truck, label: 'Free Shipping', sub: 'On orders over ₹500' },
              { icon: RefreshCw, label: '30-Day Returns', sub: 'No questions asked' },
              { icon: Shield, label: 'Secure Payment', sub: 'SSL encrypted checkout' },
              { icon: Star, label: '4.9 Rating', sub: 'From 50k+ reviews' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 px-6 lg:px-10 py-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--muted)' }}>
                  <Icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <ScrollReveal>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
          <SectionHeader eyebrow="Browse by" title="Categories" linkTo="/products" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => {
              const img = categoryImages[cat] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=800&fit=crop';
              return (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden group card-hover text-left no-underline block"
                  style={{ background: 'var(--muted)' }}
                >
                  <img src={img} alt={cat} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="text-lg font-black text-white mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>{cat}</h3>
                    <p className="text-sm text-white opacity-70">Shop collection</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      {/* Featured Products */}
      <ScrollReveal delay={100}>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
          <SectionHeader eyebrow="Handpicked for you" title="Featured Products" linkTo="/products" />
          {loadingProducts ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[3/4] rounded-2xl skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  isWishlisted={wishlistIds.has(p.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Promo Banner */}
      <ScrollReveal>
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
              <div className="text-left">
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
                  Join the ShopEasy circle and unlock member-exclusive pricing, early drops, and free returns.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 hover:-translate-y-0.5 no-underline"
                  style={{ background: 'white', color: '#111111' }}
                >
                  Create Free Account
                </Link>
                <p className="text-xs text-white opacity-40">No credit card required</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Flash Sale */}
      {saleProducts.length > 0 && (
        <ScrollReveal>
          <section className="py-12" style={{ background: 'var(--accent)' }}>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10">
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white opacity-70 mb-2">Limited time</p>
                  <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Flash Sale — ends in
                  </h2>
                </div>
                <Countdown />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {saleProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="rounded-2xl overflow-hidden group transition-all hover:-translate-y-1 no-underline"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.25)',
                    }}
                  >
                    <div className="aspect-square img-zoom overflow-hidden">
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 text-left">
                      <p className="text-xs font-semibold text-white opacity-70 mb-1">{p.category}</p>
                      <p className="text-sm font-semibold text-white mb-2 line-clamp-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        {p.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">₹{parseFloat(p.price).toFixed(2)}</span>
                        <span className="text-sm line-through text-white opacity-50">
                          ₹{(parseFloat(p.price) * 1.2).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <ScrollReveal delay={100}>
          <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
            <SectionHeader eyebrow="Community favorites" title="Best Sellers" linkTo="/products" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {bestSellers.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  isWishlisted={wishlistIds.has(p.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Editorial split */}
      <ScrollReveal>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 mb-10">
          <div className="grid lg:grid-cols-2 gap-5">
            {[
              { label: '2026 Collection', title: 'New Season,\nNew Standards.', cta: 'Shop Electronics', to: '/products?category=Electronics' },
              { label: "Men's Edit", title: 'Quiet Luxury,\nLoud Quality.', cta: 'Shop Clothing', to: '/products?category=Clothing' },
            ].map((item, i) => (
              <Link
                key={item.label}
                to={item.to}
                className="relative rounded-3xl overflow-hidden group block no-underline"
                style={{ minHeight: '400px', background: '#0A0A0A' }}
              >
                <img
                  src={editorialImages[i]}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="relative z-10 p-8 h-full flex flex-col justify-end text-left">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white opacity-60 mb-2">{item.label}</span>
                  <h3 className="text-3xl font-black text-white mb-4 whitespace-pre-line" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {item.title}
                  </h3>
                  <span
                    className="self-start flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-80"
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}
                  >
                    {item.cta} <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <ScrollReveal delay={100}>
          <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
            <SectionHeader eyebrow="Just dropped" title="New Arrivals" linkTo="/products" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {newArrivals.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  isWishlisted={wishlistIds.has(p.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Reviews */}
      <ScrollReveal>
        <section className="py-20" style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>
                What people say
              </p>
              <h2 className="text-3xl lg:text-4xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
                50,000+ happy customers
              </h2>
              <div className="flex items-center justify-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                ))}
                <span className="ml-2 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>4.9 / 5.0</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-2xl card-hover text-left"
                  style={{ background: 'var(--background)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--foreground)' }}>
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{review.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{review.product}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Instagram grid */}
      <ScrollReveal>
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 mb-10">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>
              @shopeasy
            </p>
            <h2 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              Shop the feed
            </h2>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {instagramImages.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden img-zoom cursor-pointer">
                <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
