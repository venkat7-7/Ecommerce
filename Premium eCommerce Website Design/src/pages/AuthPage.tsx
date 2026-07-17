import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, Globe, Apple } from 'lucide-react'

interface AuthPageProps {
  onNavigate: (page: string) => void
}

type AuthMode = 'signin' | 'signup' | 'forgot' | 'otp'

export default function AuthPage({ onNavigate }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [showPass, setShowPass] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))
  const handleOtp = (i: number, v: string) => {
    if (v.length > 1) return
    const next = [...otp]; next[i] = v; setOtp(next)
    if (v && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`)
      el?.focus()
    }
  }

  return (
    <div className="page-transition min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Left visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#0A0A0A' }}>
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&h=1200&fit=crop&auto=format"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <button onClick={() => onNavigate('home')} className="text-2xl font-black tracking-tighter text-white mb-auto mt-8 text-left" style={{ fontFamily: 'Manrope, sans-serif', background: 'none', border: 'none', cursor: 'pointer' }}>
            APEX
          </button>
          <div>
            <h2 className="text-4xl font-black text-white mb-3 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Premium goods for<br />the considered life.
            </h2>
            <p className="text-white opacity-50 text-sm">Join 50,000+ members with access to exclusive drops and member pricing.</p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button onClick={() => onNavigate('home')} className="lg:hidden text-xl font-black tracking-tighter mb-8 block" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)', background: 'none', border: 'none', cursor: 'pointer' }}>
            APEX
          </button>

          {mode === 'signin' && (
            <div className="fade-in-up">
              <h1 className="text-2xl font-black mb-1.5" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Welcome back</h1>
              <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>Sign in to your APEX account</p>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[{ label: 'Continue with Google', Icon: Globe }, { label: 'Continue with Apple', Icon: Apple }].map(({ label, Icon }) => (
                  <button
                    key={label}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                    style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                  >
                    <Icon size={16} /> {label.split(' ')[2]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>or continue with email</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="james@example.com"
                    className="input-field w-full px-4 py-3 rounded-xl text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      placeholder="••••••••"
                      className="input-field w-full pl-4 pr-12 py-3 rounded-xl text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <button
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <button onClick={() => setMode('forgot')} className="text-xs font-medium" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Forgot password?
                </button>
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 mb-4"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Sign In <ArrowRight size={16} />
              </button>

              <p className="text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="font-semibold" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Create one
                </button>
              </p>
            </div>
          )}

          {mode === 'signup' && (
            <div className="fade-in-up">
              <h1 className="text-2xl font-black mb-1.5" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Create account</h1>
              <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>Join the APEX circle today</p>

              <div className="space-y-4 mb-6">
                {[
                  { label: 'Full Name', id: 'name', placeholder: 'James Wilson', type: 'text' },
                  { label: 'Email Address', id: 'email', placeholder: 'james@example.com', type: 'email' },
                  { label: 'Password', id: 'password', placeholder: 'Min. 8 characters', type: 'password' },
                  { label: 'Confirm Password', id: 'confirmPassword', placeholder: '••••••••', type: 'password' },
                ].map(({ label, id, placeholder, type }) => (
                  <div key={id}>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
                    <input
                      type={type}
                      value={form[id as keyof typeof form]}
                      onChange={e => update(id, e.target.value)}
                      placeholder={placeholder}
                      className="input-field w-full px-4 py-3 rounded-xl text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => setMode('otp')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 mb-4"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Create Account <ArrowRight size={16} />
              </button>

              <p className="text-xs text-center mb-4" style={{ color: 'var(--muted-foreground)' }}>
                By creating an account, you agree to our{' '}
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>Terms of Service</span> and{' '}
                <span className="font-medium" style={{ color: 'var(--foreground)' }}>Privacy Policy</span>.
              </p>

              <p className="text-sm text-center" style={{ color: 'var(--muted-foreground)' }}>
                Already have an account?{' '}
                <button onClick={() => setMode('signin')} className="font-semibold" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Sign in
                </button>
              </p>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="fade-in-up">
              <h1 className="text-2xl font-black mb-1.5" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Reset password</h1>
              <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>Enter your email and we'll send a reset link</p>
              <div className="mb-6">
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="james@example.com"
                  className="input-field w-full px-4 py-3 rounded-xl text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <button
                onClick={() => setMode('otp')}
                className="w-full py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 mb-4"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Send Reset Link
              </button>
              <button onClick={() => setMode('signin')} className="w-full text-sm text-center" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Back to sign in
              </button>
            </div>
          )}

          {mode === 'otp' && (
            <div className="fade-in-up text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent)', color: 'white' }}>
                <span className="text-2xl">✉️</span>
              </div>
              <h1 className="text-2xl font-black mb-1.5" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}>Check your email</h1>
              <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
                We sent a 6-digit code to <strong style={{ color: 'var(--foreground)' }}>james@example.com</strong>
              </p>
              <div className="flex gap-3 justify-center mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtp(i, e.target.value)}
                    className="input-field w-12 h-14 text-center text-xl font-black rounded-xl"
                    style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--foreground)' }}
                  />
                ))}
              </div>
              <button
                onClick={() => onNavigate('account')}
                className="w-full py-4 rounded-xl text-sm font-bold transition-all hover:opacity-85 mb-4"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                Verify & Continue
              </button>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Didn't receive it?{' '}
                <button className="font-semibold" style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Resend code
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
