import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, BarChart3, Package, FileSpreadsheet, Tag, Users, AlertTriangle, Edit3, Trash2, DollarSign, ShoppingBag } from 'lucide-react';
import { apiFetch, showToast, getToken, getUser } from '../api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // States for stats
  const [stats, setStats] = useState(null);

  // States for products
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics');
  const [prodImgUrl, setProdImgUrl] = useState('');

  // States for orders
  const [orders, setOrders] = useState([]);

  // States for users
  const [users, setUsers] = useState([]);

  // States for promos
  const [promos, setPromos] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoType, setPromoType] = useState('percent');
  const [promoValue, setPromoValue] = useState('');
  const [promoMinAmount, setPromoMinAmount] = useState('0');
  const [promoMaxDiscount, setPromoMaxDiscount] = useState('');

  // Verification checks
  const token = getToken();
  const user = getUser();

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      showToast('Access denied! Admins only.', 'error');
      navigate('/');
    } else {
      loadDashboardData();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const data = await apiFetch('/api/admin/dashboard');
        setStats(data);
      } else if (activeTab === 'products') {
        const data = await apiFetch('/api/admin/products');
        setProducts(data || []);
      } else if (activeTab === 'orders') {
        const data = await apiFetch('/api/admin/orders');
        setOrders(data || []);
      } else if (activeTab === 'users') {
        const data = await apiFetch('/api/admin/users');
        setUsers(data || []);
      } else if (activeTab === 'promos') {
        const data = await apiFetch('/api/admin/promo');
        setPromos(data || []);
      }
    } catch (err) {
      showToast('Error loading dashboard: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Product Actions
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: prodName,
      description: prodDesc,
      price: parseFloat(prodPrice),
      stock_quantity: parseInt(prodStock),
      category: prodCategory,
      image_url: prodImgUrl || null,
      is_active: true
    };

    try {
      if (editingProduct) {
        await apiFetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showToast('Product updated successfully!', 'success');
      } else {
        await apiFetch('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showToast('Product added successfully!', 'success');
      }
      closeProductModal();
      loadDashboardData();
    } catch (e) {
      showToast('Failed to save product: ' + e.message, 'error');
    }
  };

  const handleProductEditClick = (p) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description || '');
    setProdPrice(p.price.toString());
    setProdStock(p.stock_quantity.toString());
    setProdCategory(p.category);
    setProdImgUrl(p.image_url || '');
    setShowProductModal(true);
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      showToast('Product deleted!', 'info');
      loadDashboardData();
    } catch (e) {
      showToast('Failed to delete product: ' + e.message, 'error');
    }
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdStock('');
    setProdCategory('Electronics');
    setProdImgUrl('');
  };

  // Order status actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await apiFetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      showToast('Order status updated!', 'success');
      loadDashboardData();
    } catch (e) {
      showToast('Failed to update status: ' + e.message, 'error');
    }
  };

  // Promo actions
  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code: promoCode.trim().toUpperCase(),
      discount_type: promoType,
      discount_value: parseFloat(promoValue),
      min_order_amount: parseFloat(promoMinAmount),
      max_discount: promoMaxDiscount ? parseFloat(promoMaxDiscount) : null,
      is_active: true
    };

    try {
      await apiFetch('/api/admin/promo', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast('Promo code created!', 'success');
      setPromoCode('');
      setPromoValue('');
      setPromoMinAmount('0');
      setPromoMaxDiscount('');
      loadDashboardData();
    } catch (e) {
      showToast('Failed to create promo: ' + e.message, 'error');
    }
  };

  const getOrderStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s.includes('deliver') || s.includes('complete')) return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
    if (s.includes('ship') || s.includes('transit')) return 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
    if (s.includes('cancel')) return 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30';
    return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard Metrics', icon: BarChart3 },
    { id: 'products', label: 'Manage Products', icon: Package },
    { id: 'orders', label: 'Customer Orders', icon: FileSpreadsheet },
    { id: 'promos', label: 'Coupons / Promos', icon: Tag },
    { id: 'users', label: 'User Accounts', icon: Users }
  ];

  return (
    <div className="page-transition grid grid-cols-1 md:grid-cols-4 gap-8 items-start text-left max-w-[1440px] mx-auto px-4 lg:px-8 py-8">

      {/* Left Sidebar Menu */}
      <div 
        className="md:col-span-1 border p-3 rounded-2xl flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <h2 className="hidden md:block font-extrabold px-4 py-2 border-b text-xs uppercase tracking-widest text-slate-400" style={{ borderColor: 'var(--border)' }}>
          Admin Panel
        </h2>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="whitespace-nowrap px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer border-none flex items-center gap-2.5 flex-shrink-0"
              style={{
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)'
              }}
            >
              <IconComponent size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Content Panel */}
      <div 
        className="md:col-span-3 border p-6 rounded-2xl min-h-[480px]"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <span className="spinner w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></span>
          </div>
        ) : (
          <>
            {/* Overview Metrics tab */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                <h3 className="text-xl font-black border-b pb-3" style={{ color: 'var(--foreground)', borderColor: 'var(--border)', fontFamily: 'Manrope, sans-serif' }}>
                  Metrics Overview
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `₹${parseFloat(stats.total_revenue).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-500', bg: 'rgba(34,197,94,0.08)' },
                    { label: 'Total Orders', value: stats.total_orders, icon: ShoppingBag, color: 'text-blue-500', bg: 'rgba(91,141,239,0.08)' },
                    { label: 'Registered Users', value: stats.total_users, icon: Users, color: 'text-violet-500', bg: 'rgba(139,92,246,0.08)' },
                    { label: 'Total Products', value: stats.total_products, icon: Package, color: 'text-amber-500', bg: 'rgba(245,158,11,0.08)' }
                  ].map((card, i) => {
                    const IconComp = card.icon;
                    return (
                      <div 
                        key={i} 
                        className="p-5 rounded-2xl border flex items-center justify-between hover:scale-[1.02] hover:shadow-md transition-all duration-200" 
                        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                      >
                        <div className="space-y-1 text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{card.label}</span>
                          <span className="text-2xl font-black block" style={{ color: 'var(--foreground)', fontFamily: 'Manrope, sans-serif' }}>{card.value}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: card.bg }}>
                          <IconComp size={18} className={card.color} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Low Stock Banner Section */}
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider text-red-500">
                    <AlertTriangle size={15} /> Low Stock Alerts (Qty &lt; 5)
                  </h4>
                  {stats.low_stock_products.length === 0 ? (
                    <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 p-4.5 rounded-xl">
                      ✔ All catalog products are adequately stocked!
                    </p>
                  ) : (
                    <div className="overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                      <table className="w-full text-left text-xs">
                        <thead className="border-b font-bold" style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                          <tr>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3 text-red-500">Stock Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-600 dark:text-slate-300" style={{ divideColor: 'var(--border)' }}>
                          {stats.low_stock_products.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/10">
                              <td className="p-3 font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</td>
                              <td className="p-3">{p.category}</td>
                              <td className="p-3 font-semibold">₹{parseFloat(p.price).toFixed(2)}</td>
                              <td className="p-3 text-red-500 font-bold">{p.stock_quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Products Manage tab */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="text-xl font-black" style={{ color: 'var(--foreground)', fontFamily: 'Manrope, sans-serif' }}>
                    Manage Products
                  </h3>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="btn-primary py-2 px-4.5 rounded-xl text-xs flex items-center gap-1 border-none font-bold"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>

                <div className="overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b font-bold" style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <tr>
                        <th className="p-3">Thumbnail</th>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600 dark:text-slate-300" style={{ divideColor: 'var(--border)' }}>
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/10">
                          <td className="p-3">
                            <img
                              src={p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                              alt=""
                              className="w-10 h-10 object-cover bg-slate-50 rounded-lg border"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'; }}
                            />
                          </td>
                          <td className="p-3 font-semibold" style={{ color: 'var(--foreground)' }}>{p.name}</td>
                          <td className="p-3">{p.category}</td>
                          <td className="p-3 font-semibold">₹{parseFloat(p.price).toFixed(2)}</td>
                          <td className={`p-3 font-bold ${p.stock_quantity < 5 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                            {p.stock_quantity}
                          </td>
                          <td className="p-3 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleProductEditClick(p)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 text-blue-500 border-none cursor-pointer transition-colors"
                              title="Edit Product"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleProductDelete(p.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-500 border-none cursor-pointer transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add/Edit Product Modal */}
                {showProductModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div 
                      className="border rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 text-left"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                    >
                      <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                        <h4 className="font-black text-base" style={{ color: 'var(--foreground)', fontFamily: 'Manrope, sans-serif' }}>
                          {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                        </h4>
                        <button
                          onClick={closeProductModal}
                          className="hover:opacity-75 transition-opacity bg-transparent border-none cursor-pointer"
                          style={{ color: 'var(--foreground)' }}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Name</label>
                            <input
                              type="text"
                              required
                              value={prodName}
                              onChange={(e) => setProdName(e.target.value)}
                              className="input-field w-full px-3 py-2 rounded-xl text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Category</label>
                            <select
                              value={prodCategory}
                              onChange={(e) => setProdCategory(e.target.value)}
                              className="w-full border rounded-xl px-3 py-2 text-xs font-semibold bg-white dark:bg-zinc-900"
                              style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
                            >
                              <option value="Electronics">Electronics</option>
                              <option value="Clothing">Clothing</option>
                              <option value="Grocery">Grocery</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Description</label>
                          <textarea
                            value={prodDesc}
                            onChange={(e) => setProdDesc(e.target.value)}
                            rows="3"
                            className="input-field w-full px-3 py-2 rounded-xl text-xs leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Price (₹)</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={prodPrice}
                              onChange={(e) => setProdPrice(e.target.value)}
                              className="input-field w-full px-3 py-2 rounded-xl text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Stock Quantity</label>
                            <input
                              type="number"
                              required
                              value={prodStock}
                              onChange={(e) => setProdStock(e.target.value)}
                              className="input-field w-full px-3 py-2 rounded-xl text-xs"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Image URL</label>
                          <input
                            type="url"
                            value={prodImgUrl}
                            onChange={(e) => setProdImgUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="input-field w-full px-3 py-2 rounded-xl text-xs"
                          />
                        </div>

                        <div className="flex gap-3 justify-end pt-3">
                          <button
                            type="button"
                            onClick={closeProductModal}
                            className="px-4.5 py-2.5 border rounded-xl text-xs font-bold bg-transparent hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
                            style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn-primary px-4.5 py-2.5 rounded-xl text-xs font-bold border-none"
                          >
                            Save Details
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-xl font-black border-b pb-3" style={{ color: 'var(--foreground)', borderColor: 'var(--border)', fontFamily: 'Manrope, sans-serif' }}>
                  Customer Orders
                </h3>

                <div className="overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b font-bold" style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <tr>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Customer Email</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600 dark:text-slate-300" style={{ divideColor: 'var(--border)' }}>
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/10">
                          <td className="p-3 font-mono font-bold select-all" style={{ color: 'var(--foreground)' }}>{o.order_number}</td>
                          <td className="p-3">{o.user?.email || 'N/A'}</td>
                          <td className="p-3 font-semibold">₹{parseFloat(o.total_amount).toFixed(2)}</td>
                          <td className="p-3">{o.payment_method}</td>
                          <td className="p-3">
                            <span className={`inline-block border text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${getOrderStatusBadge(o.status)}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                              className="border rounded-lg px-2 py-1 text-xs outline-none bg-white dark:bg-zinc-900 cursor-pointer"
                              style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Coupons tab */}
            {activeTab === 'promos' && (
              <div className="space-y-8">
                <h3 className="text-xl font-black border-b pb-3" style={{ color: 'var(--foreground)', borderColor: 'var(--border)', fontFamily: 'Manrope, sans-serif' }}>
                  Coupon & Promo Codes
                </h3>

                {/* Create Promo form */}
                <div className="border p-5 rounded-2xl space-y-4 text-xs" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <h4 className="font-black text-sm" style={{ color: 'var(--foreground)' }}>Add New Promo Code</h4>
                  <form onSubmit={handlePromoSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 block text-[10px] uppercase">Code</label>
                      <input
                        type="text"
                        required
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. WELCOME50"
                        className="input-field w-full px-3 py-2 rounded-xl text-xs uppercase font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 block text-[10px] uppercase">Discount Type</label>
                      <select
                        value={promoType}
                        onChange={(e) => setPromoType(e.target.value)}
                        className="w-full border rounded-xl px-3 py-2 text-xs bg-white dark:bg-zinc-900"
                        style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="flat">Flat Price (₹)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 block text-[10px] uppercase">Discount Value</label>
                      <input
                        type="number"
                        required
                        value={promoValue}
                        onChange={(e) => setPromoValue(e.target.value)}
                        className="input-field w-full px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 block text-[10px] uppercase">Min Order Limit (₹)</label>
                      <input
                        type="number"
                        required
                        value={promoMinAmount}
                        onChange={(e) => setPromoMinAmount(e.target.value)}
                        className="input-field w-full px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 block text-[10px] uppercase">Max Discount (Optional)</label>
                      <input
                        type="number"
                        value={promoMaxDiscount}
                        onChange={(e) => setPromoMaxDiscount(e.target.value)}
                        className="input-field w-full px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer border-none"
                    >
                      Save Promo
                    </button>
                  </form>
                </div>

                {/* Promo list table */}
                <div className="overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b font-bold" style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <tr>
                        <th className="p-3">Promo Code</th>
                        <th className="p-3">Discount Details</th>
                        <th className="p-3">Min Subtotal</th>
                        <th className="p-3">Max Discount Limit</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600 dark:text-slate-300" style={{ divideColor: 'var(--border)' }}>
                      {promos.map((pr) => (
                        <tr key={pr.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/10">
                          <td className="p-3 font-mono font-bold select-all uppercase" style={{ color: 'var(--foreground)' }}>{pr.code}</td>
                          <td className="p-3 font-semibold">
                            {pr.discount_type === 'percent' ? `${pr.discount_value}% OFF` : `₹${parseFloat(pr.discount_value).toFixed(2)} OFF`}
                          </td>
                          <td className="p-3 font-semibold">₹{parseFloat(pr.min_order_amount).toFixed(2)}</td>
                          <td className="p-3">{pr.max_discount ? `₹${parseFloat(pr.max_discount).toFixed(2)}` : 'No limit'}</td>
                          <td className="p-3">
                            <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 border border-emerald-100 dark:border-emerald-900/30 rounded-full">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-xl font-black border-b pb-3" style={{ color: 'var(--foreground)', borderColor: 'var(--border)', fontFamily: 'Manrope, sans-serif' }}>
                  User Accounts
                </h3>

                <div className="overflow-x-auto border rounded-xl" style={{ borderColor: 'var(--border)' }}>
                  <table className="w-full text-left text-xs">
                    <thead className="border-b font-bold" style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <tr>
                        <th className="p-3">User ID</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3 font-medium">System Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-slate-600 dark:text-slate-300" style={{ divideColor: 'var(--border)' }}>
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-neutral-800/10">
                          <td className="p-3 font-mono text-slate-400">{u.id}</td>
                          <td className="p-3 font-semibold" style={{ color: 'var(--foreground)' }}>{u.full_name}</td>
                          <td className="p-3">{u.email}</td>
                          <td className="p-3">
                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 border rounded-full uppercase ${u.role === 'admin'
                              ? 'bg-indigo-50 border-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30'
                              : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/50'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
