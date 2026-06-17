import { useState } from 'react'
import type { FormEvent, CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error_description ?? data.msg ?? 'Registration failed.')
        return
      }

      setSuccess(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav} className="auth-nav">
          <Link to="/" style={styles.navLogo}>Hireflow</Link>
        </nav>
        <div style={styles.content}>
        <div style={styles.card} className="auth-card">
          <h2 style={styles.title}>Check your email</h2>
          <p style={styles.successMsg}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <p style={styles.footer}>
            <Link to="/login" style={styles.link}>Back to sign in</Link>
          </p>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav} className="auth-nav">
        <Link to="/" style={styles.navLogo}>Hireflow</Link>
      </nav>
      <div style={styles.content}>
      <div style={styles.card} className="auth-card">
        <h2 style={styles.title}>Create your account</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">Password</label>
            <div style={styles.inputWrapper}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={styles.inputWithToggle}
                placeholder="••••••••"
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="confirm">Confirm password</label>
            <div style={styles.inputWrapper}>
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                style={styles.inputWithToggle}
                placeholder="••••••••"
              />
              <button
                type="button"
                style={styles.eyeButton}
                onClick={() => setShowConfirm(p => !p)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0a0a0f',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    height: '56px',
    borderBottom: '1px solid #2a2a3a',
    background: '#13131a',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxSizing: 'border-box',
  },
  navLogo: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#b1361e',
    textDecoration: 'none',
    letterSpacing: '-0.3px',
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    padding: '40px 32px',
    boxShadow: 'rgba(0,0,0,0.5) 0 10px 15px -3px, rgba(0,0,0,0.3) 0 4px 6px -2px',
  },
  title: {
    margin: '0 0 28px',
    fontSize: '22px',
    fontWeight: 700,
    color: '#ffffff',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#9a9aaa',
    textAlign: 'left',
  },
  input: {
    padding: '10px 12px',
    fontSize: '15px',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    background: '#0a0a0f',
    color: '#ffffff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputWithToggle: {
    padding: '10px 40px 10px 12px',
    fontSize: '15px',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    background: '#0a0a0f',
    color: '#ffffff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  eyeButton: {
    position: 'absolute',
    right: '10px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#9a9aaa',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    margin: 0,
    fontSize: '14px',
    color: '#e53e3e',
    textAlign: 'left',
  },
  successMsg: {
    fontSize: '15px',
    color: '#9a9aaa',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: '0 0 24px',
  },
  button: {
    marginTop: '4px',
    padding: '11px',
    fontSize: '15px',
    fontWeight: 600,
    background: '#b1361e',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  footer: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#9a9aaa',
    textAlign: 'center',
  },
  link: {
    color: '#b1361e',
    textDecoration: 'none',
    fontWeight: 500,
  },
}

export default Register
