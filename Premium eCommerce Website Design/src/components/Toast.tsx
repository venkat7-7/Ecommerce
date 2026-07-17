import { useEffect } from 'react'
import { CheckCircle, AlertCircle, X, ShoppingBag } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
}

interface ToastProps {
  toasts: ToastMessage[]
  onRemove: (id: string) => void
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 3500)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const iconMap = {
    success: <CheckCircle size={18} style={{ color: '#22C55E' }} />,
    error: <AlertCircle size={18} style={{ color: '#EF4444' }} />,
    info: <ShoppingBag size={18} style={{ color: '#5B8DEF' }} />,
  }

  return (
    <div
      className="toast-enter pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl min-w-[280px] max-w-[360px]"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="mt-0.5">{iconMap[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--foreground)' }}>{toast.title}</p>
        {toast.message && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="mt-0.5 hover:opacity-60 transition-opacity"
        style={{ color: 'var(--muted-foreground)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <X size={16} />
      </button>
    </div>
  )
}
