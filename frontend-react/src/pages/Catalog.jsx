import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Search, X, Check, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { apiFetch, showToast, getToken } from '../api';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';

export default function Catalog() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const initialSearch = queryParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSemantic, setIsSemantic] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('default');
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [displayLimit, setDisplayLimit] = useState(8);
  const [gridCols, setGridCols] = useState(4);
  const [sortOpen, setSortOpen] = useState(false);

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setDisplayLimit(8);
  }, [searchQuery, selectedCategory, sortBy, isSemantic]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedCategory(params.get('category') || 'All');
    setSearchQuery(params.get('search') || '');
  }, [location.search]);

  const loadWishlist = async () => {
    if (!getToken()) return;
    try {
      const data = await apiFetch('/api/wishlist');
      if (Array.isArray(data)) {
        setWishlistIds(new Set(data.map((item) => item.product_id)));
      }
    } catch (e) {
      console.error('Failed to load wishlist status:', e);
    }
  };

  const fetchProducts = async (query = searchQuery, semantic = isSemantic, cat = selectedCategory) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== 'All') params.append('category', cat);
      if (query.trim()) {
        params.append('search', query.trim());
        if (semantic) params.append('semantic', 'true');
      }
      const url = `/api/products?${params.toString()}`;
      const data = await apiFetch(url);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast('Error loading products: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchProducts(searchQuery, isSemantic, selectedCategory);
    }, 400);
    return () => clearTimeout(debounceTimerRef.current);
  }, [searchQuery, isSemantic, selectedCategory]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const getSortedProducts = () => {
    const list = [...products];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortBy === 'rating-desc') {
      list.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    }
    return list;
  };

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

  const sortedProducts = getSortedProducts();
  const displayedProducts = sortedProducts.slice(0, displayLimit);
  const categoriesList = ['All', 'Electronics', 'Clothing', 'Grocery'];

  const sortOptions = [
    { value: 'default', label: 'Recommended' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Best Rated' },
  ];

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[gridCols] || 'grid-cols-2 lg:grid-cols-4';

  return (
    <div className="page-transition min-h-screen text-left" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
            <Link to="/" className="hover:opacity-85 no-underline" style={{ color: 'var(--muted-foreground)' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>All Products</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
                All Products
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                {sortedProducts.length} products
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const params = new URLSearchParams(location.search);
                    if (cat === 'All') params.delete('category');
                    else params.set('category', cat);
                    navigate({ search: params.toString() });
                  }}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all border-none cursor-pointer"
                  style={{
                    background: selectedCategory === cat ? 'var(--primary)' : 'var(--muted)',
                    color: selectedCategory === cat ? 'var(--primary-foreground)' : 'var(--foreground)',
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
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="input-field w-full pl-11 pr-10 py-3 rounded-xl text-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer select-none" style={{ color: 'var(--foreground)' }}>
                <input
                  type="checkbox"
                  checked={isSemantic}
                  onChange={(e) => setIsSemantic(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                ✨ AI Search
              </label>

              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  Sort: {sortOptions.find((o) => o.value === sortBy)?.label}
                  <ChevronDown size={14} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {sortOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl z-20 py-2 slide-in-bottom"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:opacity-60 transition-opacity border-none cursor-pointer bg-transparent"
                        style={{
                          color: sortBy === option.value ? 'var(--accent)' : 'var(--foreground)',
                          fontWeight: sortBy === option.value ? 600 : 400,
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden lg:flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => setGridCols(n)}
                    className="px-3 py-2.5 transition-all border-none cursor-pointer"
                    style={{
                      background: gridCols === n ? 'var(--primary)' : 'transparent',
                      color: gridCols === n ? 'var(--primary-foreground)' : 'var(--foreground)',
                    }}
                    aria-label={`${n} column grid`}
                  >
                    {n === 2 ? <LayoutList size={16} /> : <Grid3X3 size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className={`grid ${gridClass} gap-5`}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="aspect-[3/4] rounded-2xl skeleton" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <ScrollReveal>
            <div className="text-center py-24 rounded-3xl border border-dashed" style={{ borderColor: 'var(--border)' }}>
              <span className="text-4xl block mb-2">🔍</span>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>No products found</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Try adjusting your filters or search query</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-10">
            <div className={`grid ${gridClass} gap-5`}>
              {displayedProducts.map((p, i) => (
                <ScrollReveal key={p.id} delay={Math.min(i * 60, 360)}>
                  <div className="relative">
                    {isSemantic && searchQuery.trim() && (
                      <div className="absolute top-3.5 left-3.5 z-20 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-md tracking-wider flex items-center gap-0.5">
                        <Check size={10} /> AI MATCH
                      </div>
                    )}
                    <ProductCard
                      product={p}
                      index={i}
                      isWishlisted={wishlistIds.has(p.id)}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {displayLimit < sortedProducts.length && (
              <div className="flex justify-center pt-4 pb-12">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 8)}
                  className="btn-primary px-8 py-3.5 rounded-xl text-xs uppercase font-black tracking-widest flex items-center gap-2 border-none shadow-md cursor-pointer"
                >
                  Load More ({displayedProducts.length} of {sortedProducts.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
