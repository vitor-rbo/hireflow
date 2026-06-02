import { useState } from 'react'
import type { FormEvent, CSSProperties } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error_description ?? data.msg ?? 'Login failed')
        return
      }

      login(data.access_token, data.user)
      navigate('/')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign in to Hireflow</h2>

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
              autoComplete="current-password"
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register</Link>
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

export default Login
