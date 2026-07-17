import { useState } from 'react'
import { SlidersHorizontal, Grid3X3, LayoutList, ChevronDown, X, Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import type { Product } from '../data/products'

interface ProductListingPageProps {
  onNavigate: (page: string, productId?: number) => void
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: number) => void
  wishlistedIds: number[]
}

const sortOptions = ['Recommended', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Best Rated', 'Most Reviews']
const categoryFilters = ['All', 'Footwear', 'Clothing', 'Accessories', 'Bags']
const brandFilters = ['VELO', 'AERO', 'ARTIS', 'FORMA', 'HORA', 'LUME', 'OPTIC']
const colorOptions = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#F5F5F5' },
  { name: 'Blue', hex: '#5B8DEF' },
  { name: 'Brown', hex: '#C4A882' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Red', hex: '#EF4444' },
]

export default function ProductListingPage({ onNavigate, onAddToCart, onToggleWishlist, wishlistedIds }: ProductListingPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sort, setSort] = useState('Recommended')
  const [sortOpen, setSortOpen] = useState(false)
  const [gridCols, setGridCols] = useState(4)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [activeBadge, setActiveBadge] = useState<string | null>(null)
  const [searchQ, setSearchQ] = useState('')

  const toggleBrand = (brand: string) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])
  const toggleColor = (color: string) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])

  const filtered = products.filter(p => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false
    if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false
    if (activeBadge && p.badge !== activeBadge) return false
    if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase()) && !p.brand.toLowerCase().includes(searchQ.toLowerCase())) return false
    return true
  })

  const activeFiltersCount = selectedBrands.length + selectedColors.length + (activeBadge ? 1 : 0) + (activeCategory !== 'All' ? 1 : 0)

  return (
    <div className="page-transition min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
            <button onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>Home</button>
            <span>/</span>
            <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>All Products</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
                All Products
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{filtered.length} products</p>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {categoryFilters.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: activeCategory === cat ? 'var(--primary)' : 'var(--muted)',
                    color: activeCategory === cat ? 'var(--primary-foreground)' : 'var(--foreground)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white" style={{ background: 'var(--accent)' }}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Badge filters */}
            {['Sale', 'New', 'Best Seller', 'Limited'].map(badge => (
              <button
                key={badge}
                onClick={() => setActiveBadge(activeBadge === badge ? null : badge)}
                className="px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{
                  background: activeBadge === badge ? 'var(--accent)' : 'var(--muted)',
                  color: activeBadge === badge ? 'white' : 'var(--foreground)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {badge}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Sort: {sort} <ChevronDown size={14} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {sortOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl z-20 py-2"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => { setSort(option); setSortOpen(false) }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:opacity-60 transition-opacity"
                      style={{
                        color: sort === option ? 'var(--accent)' : 'var(--foreground)',
                        fontWeight: sort === option ? 600 : 400,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid toggle */}
            <div className="hidden lg:flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
              {[2, 3, 4].map(n => (
                <button
                  key={n}
                  onClick={() => setGridCols(n)}
                  className="px-3 py-2.5 transition-all"
                  style={{
                    background: gridCols === n ? 'var(--primary)' : 'transparent',
                    color: gridCols === n ? 'var(--primary-foreground)' : 'var(--foreground)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {n === 2 ? <LayoutList size={16} /> : <Grid3X3 size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          {sidebarOpen && (
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div
                className="rounded-2xl p-5 sticky top-24"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Filters</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => { setSelectedBrands([]); setSelectedColors([]); setActiveBadge(null); setActiveCategory('All') }}
                      className="text-xs font-medium hover:opacity-60 transition-opacity flex items-center gap-1"
                      style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={12} /> Clear all
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="relative mb-5">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search products..."
                    className="input-field w-full pl-8 pr-3 py-2.5 rounded-xl text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Price Range */}
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Price Range</p>
                  <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--foreground)' }}>
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* Brand */}
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Brand</p>
                  <div className="space-y-2">
                    {brandFilters.map(brand => (
                      <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm group-hover:opacity-60 transition-opacity" style={{ color: 'var(--foreground)' }}>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Color</p>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(({ name, hex }) => (
                      <button
                        key={name}
                        onClick={() => toggleColor(name)}
                        title={name}
                        className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                        style={{
                          background: hex,
                          borderColor: selectedColors.includes(name) ? 'var(--accent)' : 'var(--border)',
                          cursor: 'pointer',
                          outline: selectedColors.includes(name) ? '2px solid var(--accent)' : 'none',
                          outlineOffset: '2px',
                        }}
                        aria-label={name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>No products found</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Try adjusting your filters</p>
              </div>
            ) : (
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: `repeat(${Math.min(gridCols, sidebarOpen ? gridCols - 1 : gridCols)}, 1fr)` }}
              >
                {filtered.map(p => (
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
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              {[1, 2, 3, '...', 8].map((page, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    background: page === 1 ? 'var(--primary)' : 'var(--card)',
                    color: page === 1 ? 'var(--primary-foreground)' : 'var(--foreground)',
                    border: page === 1 ? 'none' : '1px solid var(--border)',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
