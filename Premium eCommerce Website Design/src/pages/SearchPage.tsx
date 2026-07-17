import { useState } from 'react'
import { Search, TrendingUp, Clock, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import type { Product } from '../data/products'

interface SearchPageProps {
  onNavigate: (page: string, productId?: number) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
  wishlistedIds: number[]
}

const trending = ['Minimal Sneaker', 'Wool Jacket', 'Leather Tote', 'Swiss Watch', 'Linen Set', 'Titanium Shades']
const recentSearches = ['Cloud Nine Running', 'Heritage Jacket', 'Carbon Slide']
const popularCategories = ['Footwear', 'Clothing', 'Accessories', 'Bags', 'Watches', 'Eyewear']

export default function SearchPage({ onNavigate, onAddToCart, onToggleWishlist, wishlistedIds }: SearchPageProps) {
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState(recentSearches)

  const results = query.length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.includes(query.toLowerCase()))
      )
    : []

  const handleSearch = (term: string) => {
    setQuery(term)
    if (!recent.includes(term)) {
      setRecent(prev => [term, ...prev].slice(0, 5))
    }
  }

  return (
    <div className="page-transition max-w-[1440px] mx-auto px-6 lg:px-12 py-10 min-h-screen">
      {/* Search input */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, brands, styles..."
            className="input-field w-full pl-12 pr-12 py-4 rounded-2xl text-base"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity"
              style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {query === '' ? (
        <div className="max-w-2xl mx-auto">
          {/* Recent searches */}
          {recent.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
                  <Clock size={12} className="inline mr-1.5" />Recent Searches
                </p>
                <button onClick={() => setRecent([])} className="text-xs" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map(term => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-70"
                    style={{ background: 'var(--muted)', color: 'var(--foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    <Clock size={12} style={{ color: 'var(--muted-foreground)' }} />
                    {term}
                    <button
                      onClick={e => { e.stopPropagation(); setRecent(r => r.filter(x => x !== term)) }}
                      style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>
              <TrendingUp size={12} className="inline mr-1.5" />Trending Now
            </p>
            <div className="flex flex-wrap gap-2">
              {trending.map((term, i) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:opacity-70"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="text-xs font-black" style={{ color: 'var(--accent)' }}>#{i + 1}</span>
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted-foreground)' }}>Popular Categories</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {popularCategories.map((cat, i) => {
                const imgs = [
                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=200&fit=crop',
                  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=200&fit=crop',
                ]
                return (
                  <button
                    key={cat}
                    onClick={() => onNavigate('listing')}
                    className="relative h-20 rounded-xl overflow-hidden group text-left"
                    style={{ background: 'var(--muted)', border: 'none', cursor: 'pointer' }}
                  >
                    <img src={imgs[i]} alt={cat} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center px-4">
                      <span className="text-sm font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>{cat}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {results.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>No results for "{query}"</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Try checking your spelling, or search for something more general.</p>
            </div>
          ) : (
            <>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "<strong style={{ color: 'var(--foreground)' }}>{query}</strong>"
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {results.map(p => (
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
            </>
          )}
        </div>
      )}
    </div>
  )
}
