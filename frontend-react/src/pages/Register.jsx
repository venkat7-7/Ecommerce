import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Apple } from 'lucide-react';
import { apiFetch, showToast, getToken } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: fullName,
          email,
          password
        })
      });

      if (data && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify({
          email: email,
          role: 'user' // Default role for new accounts
        }));
        showToast('Registration successful! Welcome to ShopEasy.', 'success');

        // Dispatch event to update navbar cart badge
        window.dispatchEvent(new Event('update-cart-badge'));
        navigate('/');
      }
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 text-left">
      <div className="page-transition min-h-[85vh] flex rounded-3xl overflow-hidden border" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
      
      {/* Left Visual Banner Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#0A0A0A' }}>
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&h=1200&fit=crop&auto=format"
          alt="Premium Store Registration"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-left h-full w-full">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white mb-auto no-underline" style={{ fontFamily: 'Manrope, sans-serif' }}>
            ShopEasy
          </Link>
          <div className="pt-24">
            <h2 className="text-4xl font-black text-white mb-3 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Join the circle.<br />Access exclusive drops.
            </h2>
            <p className="text-white/60 text-xs">Create your personal workspace profile and secure Flat ₹100 Off on your first checkout.</p>
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
              Create Account
            </h1>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Sign up today and start your shopping journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Receiver name"
                className="input-field w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

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
                  placeholder="Min. 8 characters"
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field w-full pl-4 pr-12 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity bg-transparent border-none text-slate-400 cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-1.5 border-none disabled:opacity-50 mt-6"
            >
              Register Now <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      </div>
    </div>
  );
}
