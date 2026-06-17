import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav} className="home-nav">
        <span style={styles.navLogo}>Hireflow</span>
        <div style={styles.navRight} className="home-nav-right">
          <Link to="/login" style={styles.navOutlineBtn} className="home-nav-btn">Log In</Link>
          <Link to="/register" style={styles.navSolidBtn} className="home-nav-btn">Join</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroHeading} className="hero-heading">
            <span style={styles.heroWhite}>Track your path to</span>
            <br />
            <span style={styles.heroRed}>getting hired</span>
          </h1>
          <p style={styles.heroSub}>
            Keep all your job applications organised in one place.
            Never lose track of an opportunity again.
          </p>
          <Link to="/register" style={styles.heroBtn}>Get Started</Link>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div style={styles.featuresGrid} className="features-grid">
          {[
            {
              icon: '📋',
              title: 'Track Applications',
              desc: 'Add every job you apply to and keep all the details in one place',
            },
            {
              icon: '📊',
              title: 'Monitor Status',
              desc: 'Update and track each application from applied to offer',
            },
            {
              icon: '🎯',
              title: 'Stay Organised',
              desc: 'Never miss a follow up or lose track of an opportunity again',
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={styles.card}>
              <span style={styles.cardIcon}>{icon}</span>
              <h3 style={styles.cardTitle}>{title}</h3>
              <p style={styles.cardDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section style={styles.about}>
        <div style={styles.aboutInner} className="about-inner">
          <div style={styles.aboutLeft}>
            <h2 style={styles.aboutHeading}>About Hireflow</h2>
            <p style={styles.aboutText}>
              Hireflow was built as a personal project to solve a real problem —
              keeping track of job applications during a job search is harder than
              it should be. Built with React, Node.js, and Supabase.
            </p>
            <p style={styles.aboutText}>
              Built by Vitor, a Computer Science student and self-taught developer
              with experience in React, Angular, Node.js, and full stack development.
            </p>
          </div>

          <div style={styles.aboutRight}>
            <h3 style={styles.stackTitle}>Tech Stack</h3>
            <div style={styles.stackGrid}>
              {['React', 'TypeScript', 'Node.js', 'Express', 'Supabase', 'PostgreSQL'].map(tech => (
                <span key={tech} style={styles.stackBadge}>{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer} className="home-footer">
        <span style={styles.footerLogo}>Hireflow</span>
        <div style={styles.footerLinks}>
          <a
            href="https://github.com/vitor-rbo"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.socialLink}
            aria-label="GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/vitor-oliveira-621592389/"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.socialLink}
            aria-label="LinkedIn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    width: '100%',
    minHeight: '100vh',
    margin: 0,
    background: '#0a0a0f',
    color: '#ffffff',
    fontFamily: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },

  // Navbar
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    letterSpacing: '-0.3px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  navOutlineBtn: {
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: 500,
    background: 'transparent',
    color: '#ffffff',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  navSolidBtn: {
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: 600,
    background: '#b1361e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },

  // Hero
  hero: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '96px 24px 80px',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    bottom: '-60px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '300px',
    background: 'radial-gradient(ellipse at center, rgba(177,54,30,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    maxWidth: '640px',
  },
  heroHeading: {
    margin: '0 0 20px',
    fontSize: '52px',
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-1px',
  },
  heroWhite: {
    color: '#ffffff',
  },
  heroRed: {
    color: '#b1361e',
  },
  heroSub: {
    margin: '0 0 32px',
    fontSize: '17px',
    color: '#9a9aaa',
    lineHeight: 1.6,
  },
  heroBtn: {
    display: 'inline-block',
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: 600,
    background: '#b1361e',
    color: '#ffffff',
    borderRadius: '4px',
    textDecoration: 'none',
  },

  // Features
  features: {
    padding: '64px 32px',
    borderTop: '1px solid #2a2a3a',
  },
  featuresGrid: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  card: {
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: '6px',
    padding: '28px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardIcon: {
    fontSize: '28px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
  },
  cardDesc: {
    margin: 0,
    fontSize: '14px',
    color: '#9a9aaa',
    lineHeight: 1.6,
  },

  // About
  about: {
    padding: '64px 32px',
    borderTop: '1px solid #2a2a3a',
  },
  aboutInner: {
    maxWidth: '900px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'start',
  },
  aboutLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  aboutHeading: {
    margin: 0,
    fontSize: '26px',
    fontWeight: 700,
    color: '#ffffff',
  },
  aboutText: {
    margin: 0,
    fontSize: '15px',
    color: '#9a9aaa',
    lineHeight: 1.7,
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#9a9aaa',
    textDecoration: 'none',
  },
  aboutRight: {
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: '6px',
    padding: '28px 24px',
  },
  stackTitle: {
    margin: '0 0 16px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#9a9aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  stackGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  stackBadge: {
    padding: '5px 12px',
    fontSize: '13px',
    fontWeight: 500,
    background: '#0a0a0f',
    color: '#b1361e',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
  },

  // Footer
  footer: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 32px',
    background: '#13131a',
    borderTop: '1px solid #2a2a3a',
    boxSizing: 'border-box',
  },
  footerLogo: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#b1361e',
  },
  footerLinks: {
    display: 'flex',
    gap: '16px',
  },
}

export default Home
