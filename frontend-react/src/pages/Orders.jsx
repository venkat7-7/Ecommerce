import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, Tag, CreditCard, ChevronRight, ChevronDown, CheckCircle2, Truck, RefreshCw, XCircle } from 'lucide-react';
import { apiFetch, showToast, getToken } from '../api';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast('Failed to load orders: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      showToast('Login required to view orders!', 'error');
      navigate('/login');
      return;
    }
    loadOrders();
  }, []);

  const getStatusConfig = (status) => {
    const s = status.toLowerCase();
    if (s.includes('deliver') || s.includes('complete')) {
      return {
        label: 'Delivered',
        icon: CheckCircle2,
        bg: 'rgba(34,197,94,0.08)',
        border: 'rgba(34,197,94,0.2)',
        color: '#22C55E'
      };
    }
    if (s.includes('ship') || s.includes('transit')) {
      return {
        label: 'Shipped',
        icon: Truck,
        bg: 'rgba(91,141,239,0.08)',
        border: 'rgba(91,141,239,0.2)',
        color: '#5B8DEF'
      };
    }
    if (s.includes('cancel') || s.includes('fail')) {
      return {
        label: 'Cancelled',
        icon: XCircle,
        bg: 'rgba(239,68,68,0.08)',
        border: 'rgba(239,68,68,0.2)',
        color: '#EF4444'
      };
    }
    // Default Pending / Processing
    return {
      label: 'Processing',
      icon: RefreshCw,
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
      color: '#F59E0B'
    };
  };

  const toggleExpandOrder = (id) => {
    setExpandedOrderId(prev => prev === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="spinner w-12 h-12 border-4 border-t-blue-600 border-slate-200 rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="page-transition max-w-4xl mx-auto py-8 px-4 text-left">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
        <Link to="/" className="hover:opacity-85 no-underline" style={{ color: 'var(--muted-foreground)' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>Order History</span>
      </div>

      <h1 className="text-3xl font-black tracking-tight mb-8" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
        Your Orders
        {orders.length > 0 && <span className="ml-2 text-sm font-normal text-slate-400">({orders.length} orders)</span>}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-transparent space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-slate-50 dark:bg-zinc-900 text-slate-400">
            <Package size={26} />
          </div>
          <p className="text-slate-400 font-semibold">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider no-underline inline-block border-none">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusCfg = getStatusConfig(order.status);
            const StatusIcon = statusCfg.icon;
            const isExpanded = expandedOrderId === order.id;

            const orderDate = new Date(order.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={order.id} 
                className="rounded-2xl border overflow-hidden transition-all duration-200"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                
                {/* Order Summary Summary Header Card */}
                <div 
                  onClick={() => toggleExpandOrder(order.id)}
                  className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-left">
                    
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Order Placed</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{orderDate}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Order Number</span>
                      <span className="text-xs font-mono font-bold" style={{ color: 'var(--foreground)' }}>{order.order_number}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Total Bill</span>
                      <span className="text-xs font-black" style={{ color: 'var(--foreground)' }}>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center">
                      <span 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide border"
                        style={{ 
                          background: statusCfg.bg, 
                          borderColor: statusCfg.border, 
                          color: statusCfg.color 
                        }}
                      >
                        <StatusIcon size={12} />
                        {statusCfg.label}
                      </span>
                    </div>

                  </div>

                  <div className="flex-shrink-0 self-center">
                    {isExpanded ? <ChevronDown size={18} style={{ color: 'var(--muted-foreground)' }} /> : <ChevronRight size={18} style={{ color: 'var(--muted-foreground)' }} />}
                  </div>
                </div>

                {/* Collapsible Details Body */}
                {isExpanded && (
                  <div className="p-6 border-t border-dashed space-y-6 text-left" style={{ borderColor: 'var(--border)', background: 'rgba(0,0,0,0.01)' }}>
                    
                    {/* Grid Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                      
                      {/* Shipping details */}
                      <div className="space-y-1.5 p-4 rounded-xl border" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                        <h4 className="font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Delivery Location</h4>
                        <p style={{ color: 'var(--muted-foreground)' }}>
                          <strong>{order.shipping_name}</strong><br />
                          {order.shipping_address}<br />
                          {order.shipping_city}, {order.shipping_state} - {order.shipping_zip}
                        </p>
                      </div>

                      {/* Payment summaries */}
                      <div className="space-y-1.5 p-4 rounded-xl border flex flex-col justify-between" style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                        <div>
                          <h4 className="font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--foreground)' }}>Payment Method</h4>
                          <p style={{ color: 'var(--muted-foreground)' }}>{order.payment_method}</p>
                        </div>
                        {order.promo_code && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                            <Tag size={12} /> Applied Promo Coupon: {order.promo_code}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Ordered Items rows */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Items Breakdown</h4>
                      <div className="divide-y rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)', divideColor: 'var(--border)' }}>
                        {order.items && order.items.map((item) => (
                          <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={item.product?.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                                alt={item.product?.name}
                                className="w-12 h-12 object-cover border rounded-lg bg-slate-50 flex-shrink-0"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'; }}
                              />
                              <div className="min-w-0">
                                <span 
                                  className="font-bold text-xs hover:text-blue-500 cursor-pointer block truncate"
                                  style={{ color: 'var(--foreground)' }}
                                  onClick={() => navigate(`/product/${item.product_id}`)}
                                >
                                  {item.product?.name || 'Item Record Removed'}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-medium">Quantity: {item.quantity} · Price: ₹{parseFloat(item.price).toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="font-bold text-xs flex-shrink-0" style={{ color: 'var(--foreground)', fontFamily: 'Manrope, sans-serif' }}>
                              ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
