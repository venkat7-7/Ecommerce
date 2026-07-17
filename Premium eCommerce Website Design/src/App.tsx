import { useState, useCallback, useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Toast, { type ToastMessage } from './components/Toast'
import HomePage from './pages/HomePage'
import ProductListingPage from './pages/ProductListingPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage, { type CartItem } from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AuthPage from './pages/AuthPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import AccountPage from './pages/AccountPage'
import WishlistPage from './pages/WishlistPage'
import SearchPage from './pages/SearchPage'
import type { Product } from './data/products'

type Page = 'home' | 'listing' | 'product' | 'cart' | 'checkout' | 'auth' | 'success' | 'account' | 'wishlist' | 'search'

const NO_NAV_FOOTER: Page[] = ['auth', 'success']

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [productId, setProductId] = useState<number>(1)
  const [darkMode, setDarkMode] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistedIds, setWishlistedIds] = useState<number[]>([])
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const navigate = useCallback((p: string, pid?: number) => {
    setPage(p as Page)
    if (pid !== undefined) setProductId(pid)
  }, [])

  const addToCart = useCallback((product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { product, quantity: 1 }]
    })
    addToast({ type: 'info', title: 'Added to cart', message: product.name })
  }, [addToast])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCartItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i))
  }, [])

  const removeItem = useCallback((productId: number) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId))
    addToast({ type: 'success', title: 'Item removed from cart' })
  }, [addToast])

  const toggleWishlist = useCallback((pid: number) => {
    setWishlistedIds(prev => {
      const isWishlisted = prev.includes(pid)
      addToast({
        type: isWishlisted ? 'success' : 'info',
        title: isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist',
      })
      return isWishlisted ? prev.filter(id => id !== pid) : [...prev, pid]
    })
  }, [addToast])

  const showNav = !NO_NAV_FOOTER.includes(page)
  const showFooter = !NO_NAV_FOOTER.includes(page) && page !== 'checkout'

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--foreground)' }}>
      {showNav && (
        <Navigation
          onNavigate={navigate}
          cartCount={cartCount}
          wishlistCount={wishlistedIds.length}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(d => !d)}
        />
      )}

      <main>
        {page === 'home' && (
          <HomePage
            onNavigate={navigate}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        )}
        {page === 'listing' && (
          <ProductListingPage
            onNavigate={navigate}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        )}
        {page === 'product' && (
          <ProductDetailPage
            productId={productId}
            onNavigate={navigate}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        )}
        {page === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onNavigate={navigate}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        )}
        {page === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onNavigate={navigate}
          />
        )}
        {page === 'auth' && (
          <AuthPage onNavigate={navigate} />
        )}
        {page === 'success' && (
          <OrderSuccessPage onNavigate={navigate} />
        )}
        {page === 'account' && (
          <AccountPage onNavigate={navigate} />
        )}
        {page === 'wishlist' && (
          <WishlistPage
            wishlistedIds={wishlistedIds}
            onNavigate={navigate}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
          />
        )}
        {page === 'search' && (
          <SearchPage
            onNavigate={navigate}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistedIds={wishlistedIds}
          />
        )}
      </main>

      {showFooter && <Footer onNavigate={navigate} />}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
