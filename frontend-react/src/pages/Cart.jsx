import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, Truck, Tag, ArrowRight, ShoppingBag, CreditCard, ChevronLeft, CheckCircle2, Ticket } from 'lucide-react';
import { apiFetch, showToast, getToken } from '../api';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [promoMessageType, setPromoMessageType] = useState('info'); // 'info' | 'success' | 'error'

  // Checkout states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/cart');
      setCart(data);

      // Restore promo code if exists in session
      const savedPromo = sessionStorage.getItem('applied_promo');
      if (savedPromo) {
        const parsed = JSON.parse(savedPromo);
        // Verify if subtotal still meets min requirement
        if (data && data.total >= parsed.min_order_amount) {
          setAppliedPromo(parsed);
          setPromoCode(parsed.code);
          setPromoMessage(`Code ${parsed.code} applied!`);
          setPromoMessageType('success');
        } else {
          sessionStorage.removeItem('applied_promo');
        }
      }
    } catch (err) {
      showToast('Failed to load cart: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      showToast('Login required to access your cart!', 'error');
      navigate('/login');
      return;
    }
    loadCart();
  }, []);

  useEffect(() => {
    if (isCheckingOut) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          const saved = localStorage.getItem(`profile_${u.email}`);
          if (saved) {
            const profileData = JSON.parse(saved);
            if (profileData.name && !shippingName) setShippingName(profileData.name);
            if (profileData.defaultAddress) {
              const def = profileData.defaultAddress;
              if (def.street && !shippingAddress) setShippingAddress(def.street);
              if (def.city && !shippingCity) setShippingCity(def.city);
              if (def.state && !shippingState) setShippingState(def.state);
              if (def.zip && !shippingZip) setShippingZip(def.zip);
            }
          }
        } catch (e) {
          console.error('Failed to pre-fill address:', e);
        }
      }
    }
  }, [isCheckingOut]);

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await apiFetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQty })
      });
      await loadCart();
      window.dispatchEvent(new Event('update-cart-badge'));
    } catch (e) {
      showToast('Failed to update cart: ' + e.message, 'error');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!window.confirm('Remove this item from your cart?')) return;
    try {
      await apiFetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      showToast('Item removed!', 'info');
      await loadCart();
      window.dispatchEvent(new Event('update-cart-badge'));
    } catch (e) {
      showToast('Failed to remove item: ' + e.message, 'error');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
    try {
      await apiFetch('/api/cart', { method: 'DELETE' });
      showToast('Cart cleared!', 'info');
      setCart(null);
      setAppliedPromo(null);
      sessionStorage.removeItem('applied_promo');
      window.dispatchEvent(new Event('update-cart-badge'));
    } catch (e) {
      showToast('Failed to clear cart: ' + e.message, 'error');
    }
  };

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      showToast('Please enter a promo code', 'error');
      return;
    }

    setPromoMessage('Validating...');
    setPromoMessageType('info');

    try {
      const res = await apiFetch('/api/orders/validate-promo', {
        method: 'POST',
        body: JSON.stringify({
          promo_code: code,
          subtotal: cart.total
        })
      });

      const promoInfo = {
        code: res.code,
        discount_type: res.discount_type,
        discount_value: res.discount_value,
        min_order_amount: res.min_order_amount || 0.0,
        max_discount: res.max_discount || null,
        discount_amount: res.discount_amount
      };

      setAppliedPromo(promoInfo);
      sessionStorage.setItem('applied_promo', JSON.stringify(promoInfo));
      setPromoMessage(`Promo code applied! Saved ₹${parseFloat(res.discount_amount).toFixed(2)}`);
      setPromoMessageType('success');
      showToast('Promo code applied!', 'success');
    } catch (err) {
      setAppliedPromo(null);
      sessionStorage.removeItem('applied_promo');
      setPromoMessage(err.message);
      setPromoMessageType('error');
      showToast('Failed to apply promo: ' + err.message, 'error');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingName || !shippingAddress || !shippingCity || !shippingState || !shippingZip) {
      showToast('Please fill all shipping details!', 'error');
      return;
    }
    setPlacingOrder(true);

    try {
      const order = await apiFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          shipping_name: shippingName,
          shipping_address: shippingAddress,
          shipping_city: shippingCity,
          shipping_state: shippingState,
          shipping_zip: shippingZip,
          payment_method: paymentMethod,
          promo_code: appliedPromo ? appliedPromo.code : null
        })
      });

      sessionStorage.removeItem('applied_promo');
      setAppliedPromo(null);
      setPlacedOrderNumber(order.order_number);
      setCart(null);
      showToast('Order placed successfully!', 'success');
      window.dispatchEvent(new Event('update-cart-badge'));
    } catch (err) {
      showToast('Checkout failed: ' + err.message, 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Computations
  const subtotal = cart ? parseFloat(cart.total) : 0;
  let discount = 0;
  if (appliedPromo && subtotal >= appliedPromo.min_order_amount) {
    discount = parseFloat(appliedPromo.discount_amount);
  }
  const shippingCharge = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
  const finalTotal = Math.max(0, subtotal - discount + shippingCharge);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="spinner w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></span>
      </div>
    );
  }

  /* Success State Page Layout */
  if (placedOrderNumber) {
    return (
      <div className="page-transition max-w-xl mx-auto py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black mb-3" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
          🎉 Order Confirmed!
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
          Thank you for your purchase. We are processing your order and preparing dispatch notifications.
        </p>

        {/* Invoice breakdown box */}
        <div className="rounded-2xl p-6 border mb-8 text-left" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center pb-4 border-b text-xs uppercase font-bold tracking-wider" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            <span>Order Summary</span>
            <span>ShopEasy</span>
          </div>
          <div className="py-4 space-y-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--muted-foreground)' }}>Order Number:</span>
              <strong className="font-mono text-blue-500 select-all">{placedOrderNumber}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--muted-foreground)' }}>Payment Method:</span>
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{paymentMethod}</span>
            </div>
          </div>
          <div className="pt-4 flex justify-between text-base font-black" style={{ color: 'var(--foreground)' }}>
            <span>Amount Paid:</span>
            <span>₹{(subtotal - discount + shippingCharge).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="btn-primary py-3.5 px-6 rounded-xl text-xs uppercase font-bold tracking-wider text-center no-underline border-none"
          >
            Track Order Details
          </Link>
          <Link
            to="/products"
            className="py-3.5 px-6 rounded-xl text-xs uppercase font-bold tracking-wider text-center no-underline border"
            style={{ color: 'var(--foreground)', borderColor: 'var(--border)', background: 'var(--muted)' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* Empty Cart Layout */
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="page-transition max-w-xl mx-auto py-24 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-slate-100 dark:bg-zinc-900">
          <ShoppingBag size={32} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-black mb-2" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Your cart is empty</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>Discover our collections and add premium essentials to your bag.</p>
        <Link
          to="/products"
          className="btn-primary py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider font-bold no-underline inline-block border-none"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="page-transition max-w-[1440px] mx-auto px-6 lg:px-12 py-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
          {isCheckingOut ? 'Checkout Secure' : 'Shopping Bag'}
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>
        <button
          onClick={() => {
            if (isCheckingOut) setIsCheckingOut(false);
            else navigate('/products');
          }}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-transparent border-none cursor-pointer"
          style={{ color: 'var(--accent)' }}
        >
          <ChevronLeft size={16} />
          {isCheckingOut ? 'Back to Bag' : 'Continue Shopping'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Col: Cart Items OR Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {!isCheckingOut ? (
            /* CART OVERVIEW LIST */
            <div className="space-y-4">
              
              {/* Free shipping threshold banner */}
              {shippingCharge > 0 ? (
                <div 
                  className="flex items-center gap-3 p-4.5 rounded-2xl text-xs font-semibold"
                  style={{ background: 'rgba(91,141,239,0.08)', border: '1px solid rgba(91,141,239,0.2)', color: 'var(--foreground)' }}
                >
                  <Truck size={16} style={{ color: 'var(--accent)' }} />
                  <p>
                    Add <strong>₹{(500 - subtotal).toFixed(2)}</strong> more for FREE shipping!
                  </p>
                </div>
              ) : (
                <div 
                  className="flex items-center gap-3 p-4.5 rounded-2xl text-xs font-semibold"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--foreground)' }}
                >
                  <Truck size={16} className="text-emerald-500" />
                  <p>Your order qualifies for <strong>Free Premium Shipping</strong>!</p>
                </div>
              )}

              {/* Items Card List */}
              <div className="rounded-3xl border divide-y" style={{ background: 'var(--card)', borderColor: 'var(--border)', divideColor: 'var(--border)' }}>
                {cart.items.map((item) => (
                  <div key={item.id} className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    
                    {/* Item Thumbnail */}
                    <div 
                      className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border flex-shrink-0 cursor-pointer img-zoom"
                      onClick={() => navigate(`/product/${item.product.id}`)}
                    >
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {item.product.category}
                      </span>
                      <h3 
                        className="text-sm font-bold truncate hover:text-blue-500 cursor-pointer transition-colors"
                        style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
                        onClick={() => navigate(`/product/${item.product.id}`)}
                      >
                        {item.product.name}
                      </h3>
                      <div className="text-xs font-bold mt-1 text-slate-400">
                        Unit Price: ₹{parseFloat(item.product.price).toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Picker + Subtotal */}
                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-xl overflow-hidden bg-transparent" style={{ borderColor: 'var(--border)' }}>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-500 bg-transparent border-none cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold" style={{ color: 'var(--foreground)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-500 bg-transparent border-none cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-sm font-black w-24 text-right" style={{ color: 'var(--foreground)', fontFamily: 'Manrope, sans-serif' }}>
                        ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 bg-transparent border-none cursor-pointer transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Clear Entire Cart actions */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleClearCart}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 bg-transparent cursor-pointer transition-all"
                >
                  Clear Bag
                </button>
              </div>

            </div>
          ) : (
            /* SECURE CHECKOUT SHIELD FORM */
            <div className="rounded-3xl p-6 sm:p-8 border space-y-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h2 className="text-xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
                Shipping Information
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="Receiver name"
                      className="input-field w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Delivery Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street address, building, apartment"
                      className="input-field w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">City</label>
                    <input
                      type="text"
                      required
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      placeholder="City"
                      className="input-field w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">State</label>
                    <input
                      type="text"
                      required
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value)}
                      placeholder="State"
                      className="input-field w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Zip/Postal Code</label>
                    <input
                      type="text"
                      required
                      value={shippingZip}
                      onChange={(e) => setShippingZip(e.target.value)}
                      placeholder="PIN Code"
                      className="input-field w-full px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm font-semibold border bg-white dark:bg-zinc-900"
                      style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
                    >
                      <option value="Cash on Delivery">Cash on Delivery (Mock)</option>
                      <option value="UPI">UPI Payment (Mock)</option>
                      <option value="Credit Card">Credit / Debit Card (Mock)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full btn-primary py-4 rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 border-none disabled:opacity-50"
                  >
                    <CreditCard size={15} />
                    {placingOrder ? 'Processing Payment...' : 'Confirm Order & Pay'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Col: Summary sidebar & Discounts */}
        <div className="space-y-6">
          <div className="rounded-3xl p-6 border text-left" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-black mb-4 tracking-tight border-b pb-3" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)', borderColor: 'var(--border)' }}>
              Summary & Bills
            </h2>

            {/* Coupons box */}
            <div className="space-y-2 mb-6">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. FLAT100"
                  disabled={!!appliedPromo}
                  className="input-field flex-1 px-4 py-2.5 rounded-xl text-sm uppercase font-mono tracking-wider"
                />
                {appliedPromo ? (
                  <button
                    onClick={() => {
                      setAppliedPromo(null);
                      setPromoCode('');
                      setPromoMessage('');
                      sessionStorage.removeItem('applied_promo');
                      showToast('Coupon removed.', 'info');
                    }}
                    className="px-4 py-2 border rounded-xl text-xs font-bold text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 bg-transparent cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleApplyPromo}
                    className="px-4.5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-85 border-none cursor-pointer"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    Apply
                  </button>
                )}
              </div>

              {promoMessage && (
                <div 
                  className={`text-[11px] font-semibold mt-1 px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 ${
                    promoMessageType === 'success' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400' 
                      : promoMessageType === 'error' 
                      ? 'bg-red-50 text-red-500 border-red-100 dark:bg-red-950/20 dark:text-red-400'
                      : 'bg-blue-50 text-blue-500 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400'
                  }`}
                >
                  <Ticket size={12} />
                  <span>{promoMessage}</span>
                </div>
              )}
            </div>

            {/* Calculations items block */}
            <div className="space-y-3.5 border-b pb-4 mb-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-600">
                  <span>Coupon Discount:</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span>Shipping:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-black mb-6" style={{ color: 'var(--foreground)', fontFamily: 'Manrope, sans-serif' }}>
              <span>Total Estimate:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            {/* Checkout action Button toggler */}
            {!isCheckingOut ? (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full btn-primary py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 border-none"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>
            ) : null}

          </div>
        </div>

      </div>
    </div>
  );
}
