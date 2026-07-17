import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon, LogOut, ShieldAlert } from 'lucide-react';
import { apiFetch, getUser, getToken, showToast } from '../api';
export default function Navbar({ darkMode, onToggleDark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getUser());

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [fadeState, setFadeState] = useState('opacity-100 translate-y-0');

  // Profile management states
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const [hasSecondary, setHasSecondary] = useState(false);
  const [secStreet, setSecStreet] = useState('');
  const [secCity, setSecCity] = useState('');
  const [secState, setSecState] = useState('');
  const [secZip, setSecZip] = useState('');

  const [profile, setProfile] = useState(null);

  const loadProfile = () => {
    const u = getUser();
    if (u && u.email) {
      setProfileEmail(u.email);
      const saved = localStorage.getItem(`profile_${u.email}`);
      if (saved) {
        try {
          const profileData = JSON.parse(saved);
          setProfile(profileData);
          setProfileName(profileData.name || u.full_name || '');
          setProfilePhone(profileData.phone || '');
          
          if (profileData.defaultAddress) {
            setStreet(profileData.defaultAddress.street || '');
            setCity(profileData.defaultAddress.city || '');
            setState(profileData.defaultAddress.state || '');
            setZip(profileData.defaultAddress.zip || '');
          } else {
            setStreet('');
            setCity('');
            setState('');
            setZip('');
          }

          if (profileData.secondaryAddress) {
            setHasSecondary(true);
            setSecStreet(profileData.secondaryAddress.street || '');
            setSecCity(profileData.secondaryAddress.city || '');
            setSecState(profileData.secondaryAddress.state || '');
            setSecZip(profileData.secondaryAddress.zip || '');
          } else {
            setHasSecondary(false);
            setSecStreet('');
            setSecCity('');
            setSecState('');
            setSecZip('');
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setProfile(null);
        setProfileName(u.full_name || '');
        setProfilePhone('');
        setStreet('');
        setCity('');
        setState('');
        setZip('');
        setHasSecondary(false);
        setSecStreet('');
        setSecCity('');
        setSecState('');
        setSecZip('');
      }
    }
  };

  const handleSaveProfile = () => {
    const u = getUser();
    if (!u || !u.email) return;
    const profileData = {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      defaultAddress: { street, city, state, zip },
      secondaryAddress: hasSecondary ? { street: secStreet, city: secCity, state: secState, zip: secZip } : null
    };

    localStorage.setItem(`profile_${u.email}`, JSON.stringify(profileData));
    setProfile(profileData);
    setProfileOpen(false);
    showToast('Profile and addresses saved successfully!', 'success');
    window.dispatchEvent(new Event('profile-updated'));
  };

  // Sync profile details listener
  const reloadProfileEvent = () => {
    const u = getUser();
    if (u && u.email) {
      const saved = localStorage.getItem(`profile_${u.email}`);
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {}
      }
    }
  };

  useEffect(() => {
    reloadProfileEvent();
    window.addEventListener('profile-updated', reloadProfileEvent);
    return () => window.removeEventListener('profile-updated', reloadProfileEvent);
  }, [token]);

  const announcements = [
    "Free shipping on orders over ₹500 · Secure Checkout · Powered by AI",
    "Flat ₹100 Off on first checkout · Use Coupon code: FLAT100 (Min. spend ₹500)",
    "Get 10% Off on Electronics · Use Coupon code: WELCOME10 (Min. spend ₹500)",
    "Secure 20% Off on orders over ₹1000 · Use Coupon code: SAVE20"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeState('opacity-0 -translate-y-1');
      setTimeout(() => {
        setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
        setFadeState('opacity-0 translate-y-1');
        setTimeout(() => {
          setFadeState('opacity-100 translate-y-0');
        }, 50);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load and refresh count badges
  const loadBadgeCounts = async (activeToken = token) => {
    if (!activeToken) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }
    try {
      // Fetch cart count
      const cart = await apiFetch('/api/cart');
      if (cart && cart.items) {
        const totalCart = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCart);
      }
      
      // Fetch wishlist count
      const wishlist = await apiFetch('/api/wishlist');
      if (Array.isArray(wishlist)) {
        setWishlistCount(wishlist.length);
      }
    } catch (e) {
      console.error('Failed to load navbar badge counts:', e);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync auth states and cart/wishlist counters on navigation
  useEffect(() => {
    const currentToken = getToken();
    setToken(currentToken);
    setUser(getUser());
    loadBadgeCounts(currentToken);
  }, [location]);

  useEffect(() => {
    const handleCartUpdate = () => loadBadgeCounts(getToken());
    window.addEventListener('update-cart-badge', handleCartUpdate);
    return () => {
      window.removeEventListener('update-cart-badge', handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    showToast('Logged out successfully!', 'info');
    navigate('/login');
    setMobileOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const trendingSearches = ['Minimal Sneaker', 'Wool Jacket', 'Leather Tote', 'Swiss Watch', 'Linen Set'];

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="text-center py-2.5 text-[10px] font-black tracking-widest uppercase overflow-hidden relative flex items-center justify-center h-9"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        <div className={`transition-all duration-300 transform ${fadeState}`}>
          {announcements[announcementIdx]}
        </div>
      </div>

      {/* Main Nav */}
      <nav
        className="sticky top-0 z-40 transition-all duration-300 border-b"
        style={{
          background: scrolled
            ? darkMode
              ? 'rgba(10,10,10,0.85)'
              : 'rgba(250,250,250,0.85)'
            : 'var(--background)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter no-underline flex items-center gap-2"
              style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
            >
              <span className="text-3xl">🛍️</span>
              <span>ShopEasy</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold hover:opacity-60 transition-opacity no-underline" style={{ color: 'var(--foreground)' }}>Home</Link>
              <Link to="/products" className="text-sm font-semibold hover:opacity-60 transition-opacity no-underline" style={{ color: 'var(--foreground)' }}>Products</Link>
              {token && <Link to="/orders" className="text-sm font-semibold hover:opacity-60 transition-opacity no-underline" style={{ color: 'var(--foreground)' }}>Orders</Link>}
              {token && user && user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-bold text-rose-500 hover:opacity-80 transition-opacity no-underline flex items-center gap-1">
                  <ShieldAlert size={14} /> Admin
                </Link>
              )}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity bg-transparent"
                style={{ color: 'var(--foreground)', border: 'none', cursor: 'pointer' }}
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <button
                onClick={onToggleDark}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity bg-transparent"
                style={{ color: 'var(--foreground)', border: 'none', cursor: 'pointer' }}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                to="/wishlist"
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity no-underline"
                style={{ color: 'var(--foreground)' }}
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {token && user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      loadProfile();
                      setProfileOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors bg-transparent border-none cursor-pointer"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <User size={16} />
                    <span className="hidden md:inline text-xs font-semibold max-w-[120px] truncate">
                      {profile?.name || user.full_name || user.email.split('@')[0]}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity bg-transparent"
                    style={{ color: 'var(--foreground)', border: 'none', cursor: 'pointer' }}
                    aria-label="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:opacity-60 transition-opacity no-underline"
                  style={{ color: 'var(--foreground)' }}
                  aria-label="Account Login"
                >
                  <User size={18} />
                </Link>
              )}

              <Link
                to="/cart"
                className="relative flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold hover:opacity-85 transition-opacity no-underline"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                aria-label="Cart"
              >
                <ShoppingBag size={16} />
                <span>{cartCount}</span>
              </Link>

              {/* Mobile Menu */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center bg-transparent"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{ color: 'var(--foreground)', border: 'none', cursor: 'pointer' }}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Overlay Backdrop */}
        <div 
          onClick={() => setMobileOpen(false)}
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />

        {/* Mobile Slide-in Drawer Container */}
        <div 
          className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 shadow-2xl transition-transform duration-300 transform lg:hidden flex flex-col p-6 text-left`}
          style={{ 
            background: 'var(--card)', 
            borderLeft: '1px solid var(--border)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)' 
          }}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
            <span className="font-black tracking-tight text-lg" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Menu</span>
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-1 hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer"
              style={{ color: 'var(--foreground)' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4 flex-grow">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-base font-bold no-underline border-b"
              style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-base font-bold no-underline border-b"
              style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
            >
              Products
            </Link>
            {token && (
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-base font-bold no-underline border-b"
                style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
              >
                Orders
              </Link>
            )}
            {token && user && user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-base font-bold text-rose-500 no-underline border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Drawer Footer info */}
          {token && user && (
            <div className="border-t pt-4 text-xs font-semibold text-slate-400 space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <span>Logged in as:</span>
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  {profile?.name || user.full_name || user.email.split('@')[0]}
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  loadProfile();
                  setProfileOpen(true);
                }}
                className="w-full py-2.5 rounded-xl border text-center text-xs tracking-wider uppercase font-bold bg-transparent"
                style={{ color: 'var(--foreground)', borderColor: 'var(--border)', cursor: 'pointer' }}
              >
                Edit Profile & Address
              </button>
              <button
                onClick={handleLogout}
                className="w-full btn-primary py-2.5 rounded-xl text-center text-xs tracking-wider uppercase border-none font-bold"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Search Overlay Modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" 
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
        >
          <div className="w-full max-w-2xl fade-in-up">
            <div
              className="rounded-2xl p-6 shadow-2xl"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 mb-6">
                <Search size={20} style={{ color: 'var(--muted-foreground)' }} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, categories..."
                  className="input-field flex-1 text-base bg-transparent px-2"
                  style={{ border: 'none', boxShadow: 'none', fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </form>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--muted-foreground)' }}>Trending Searches</p>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all hover:opacity-80 border-none"
                      style={{ background: 'var(--muted)', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
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

      {/* Profile Drawer Backdrop Overlay */}
      <div 
        onClick={() => setProfileOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${profileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Profile Drawer Slide-in Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[450px] max-w-[90vw] z-50 shadow-2xl transition-transform duration-300 transform flex flex-col p-6 text-left`}
        style={{ 
          background: 'var(--card)', 
          borderLeft: '1px solid var(--border)',
          transform: profileOpen ? 'translateX(0)' : 'translateX(100%)' 
        }}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <User size={18} className="text-blue-500" />
            <span className="font-black tracking-tight text-lg" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              Profile & Address
            </span>
          </div>
          <button 
            onClick={() => setProfileOpen(false)}
            className="p-1 hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer"
            style={{ color: 'var(--foreground)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable form */}
        <div className="flex-grow overflow-y-auto pr-1 space-y-6">
          {/* User Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Account Details</h4>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  disabled
                  className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold opacity-60 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Default Address Section */}
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Primary Delivery Address</h4>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Street Address</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Building, street, flat no."
                  className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">ZIP / PIN Code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="PIN Code"
                  className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Secondary Address Option */}
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <input
                id="has-secondary-checkbox"
                type="checkbox"
                checked={hasSecondary}
                onChange={(e) => setHasSecondary(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="has-secondary-checkbox" className="text-xs font-bold text-slate-500 cursor-pointer">
                Add a secondary shipping address
              </label>
            </div>

            {hasSecondary && (
              <div className="space-y-3 mt-3 animate-fade-in text-left">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Secondary Delivery Address</h4>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={secStreet}
                    onChange={(e) => setSecStreet(e.target.value)}
                    placeholder="Secondary Address line"
                    className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">City</label>
                    <input
                      type="text"
                      value={secCity}
                      onChange={(e) => setSecCity(e.target.value)}
                      placeholder="City"
                      className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">State</label>
                    <input
                      type="text"
                      value={secState}
                      onChange={(e) => setSecState(e.target.value)}
                      placeholder="State"
                      className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">ZIP / PIN Code</label>
                  <input
                    type="text"
                    value={secZip}
                    onChange={(e) => setSecZip(e.target.value)}
                    placeholder="PIN Code"
                    className="input-field w-full px-4 py-2.5 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Save Button */}
        <div className="pt-4 border-t mt-6" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleSaveProfile}
            className="w-full btn-primary py-3 rounded-xl text-xs uppercase font-black tracking-widest border-none cursor-pointer"
          >
            Save Details
          </button>
        </div>
      </div>
    </>
  );
}
