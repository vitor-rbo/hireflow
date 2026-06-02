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
        <div style={styles.card}>
          <h2 style={styles.title}>Check your email</h2>
          <p style={styles.successMsg}>
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <p style={styles.footer}>
            <Link to="/login" style={styles.link}>Back to sign in</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
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
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              style={styles.input}
              placeholder="••••••••"
            />
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
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'var(--bg)',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '40px 32px',
    boxShadow: 'var(--shadow)',
  },
  title: {
    margin: '0 0 28px',
    fontSize: '22px',
    fontWeight: 600,
    color: 'var(--text-h)',
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
    color: 'var(--text-h)',
    textAlign: 'left',
  },
  input: {
    padding: '10px 12px',
    fontSize: '15px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    background: 'var(--bg)',
    color: 'var(--text-h)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  error: {
    margin: 0,
    fontSize: '14px',
    color: '#e53e3e',
    textAlign: 'left',
  },
  successMsg: {
    fontSize: '15px',
    color: 'var(--text)',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: '0 0 24px',
  },
  button: {
    marginTop: '4px',
    padding: '11px',
    fontSize: '15px',
    fontWeight: 600,
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  footer: {
    marginTop: '20px',
    fontSize: '14px',
    color: 'var(--text)',
    textAlign: 'center',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontWeight: 500,
  },
}

export default Register
