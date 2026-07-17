import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Globe, Apple } from 'lucide-react';
import { apiFetch, showToast, getToken } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify({
          email: email,
          role: data.role
        }));
        showToast('Welcome back! Login successful.', 'success');

        // Dispatch event to update navbar cart badge
        window.dispatchEvent(new Event('update-cart-badge'));

        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 text-left">
      <div className="page-transition min-h-[75vh] flex rounded-3xl overflow-hidden border" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
      
      {/* Left Visual Banner Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#0A0A0A' }}>
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&h=1200&fit=crop&auto=format"
          alt="Premium Shopping Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-left h-full w-full">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white mb-auto no-underline" style={{ fontFamily: 'Manrope, sans-serif' }}>
            ShopEasy
          </Link>
          <div className="pt-24">
            <h2 className="text-4xl font-black text-white mb-3 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Premium goods for<br />the considered life.
            </h2>
            <p className="text-white/60 text-xs">Join our member circle for curated collections and access to special promo pricing.</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 text-left" style={{ background: 'var(--card)' }}>
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden mb-6">
            <Link to="/" className="text-xl font-black tracking-tighter no-underline" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              ShopEasy
            </Link>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>
              Welcome back
            </h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Sign in to your ShopEasy account to proceed
            </p>
          </div>

          {/* Third-party visual mocks */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border bg-transparent"
              style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
            >
              <Globe size={14} /> Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border bg-transparent"
              style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
            >
              <Apple size={14} /> Apple
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[10px] uppercase font-bold text-slate-400">or use email credentials</span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="input-field w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field w-full pl-4 pr-12 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity bg-transparent border-none text-slate-400 cursor-pointer"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 border-none disabled:opacity-50 mt-6"
            >
              Sign In <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      </div>
    </div>
  );
}
