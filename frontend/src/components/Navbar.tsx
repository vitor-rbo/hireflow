import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>Hireflow</Link>
      <div style={styles.right}>
        {user && <span style={styles.email}>{user.email}</span>}
        <button style={styles.logoutButton} onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  )
}

const styles: Record<string, CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '56px',
    borderBottom: '1px solid #2a2a3a',
    background: '#13131a',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    boxSizing: 'border-box',
  },
  logo: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#b1361e',
    textDecoration: 'none',
    letterSpacing: '-0.3px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  email: {
    fontSize: '13px',
    color: '#9a9aaa',
  },
  logoutButton: {
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: 500,
    background: 'transparent',
    color: '#9a9aaa',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    cursor: 'pointer',
  },
}

export default Navbar
