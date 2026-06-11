import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: number) => void
}

const TYPE_COLORS: Record<ToastType, { border: string; icon: string }> = {
  success: { border: '#16a34a', icon: '✓' },
  error:   { border: '#b1361e', icon: '✕' },
  info:    { border: '#2563eb', icon: 'i' },
}

const Toast = ({ toast, onDismiss }: ToastProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation on mount
    const enterFrame = requestAnimationFrame(() => setVisible(true))

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onDismiss(toast.id), 300)
    }, 3000)

    return () => {
      cancelAnimationFrame(enterFrame)
      clearTimeout(timer)
    }
  }, [toast.id, onDismiss])

  const { border, icon } = TYPE_COLORS[toast.type]

  const toastStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px 16px',
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderLeft: `3px solid ${border}`,
    borderRadius: '4px',
    boxShadow: 'rgba(0,0,0,0.5) 0 8px 24px -4px',
    minWidth: '280px',
    maxWidth: '360px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: 'opacity 0.25s ease, transform 0.25s ease',
    pointerEvents: 'auto',
  }

  const iconStyle: CSSProperties = {
    flexShrink: 0,
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: border,
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
  }

  return (
    <div style={toastStyle} role="alert">
      <div style={iconStyle}>{icon}</div>
      <span style={{ flex: 1, fontSize: '14px', color: '#ffffff', lineHeight: '1.4' }}>
        {toast.message}
      </span>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(() => onDismiss(toast.id), 300)
        }}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          color: '#9a9aaa',
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1,
          padding: '0',
          marginTop: '1px',
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: number) => void
}

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  const containerStyle: CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 9999,
    pointerEvents: 'none',
  }

  return (
    <div style={containerStyle}>
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export default Toast
