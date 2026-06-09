import { useState, useEffect } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import type { Job } from '../types'
import Navbar from '../components/Navbar'

const STATUS_OPTIONS = ['applied', 'interview', 'offer', 'rejected'] as const

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  applied:   { bg: '#dbeafe', color: '#1d4ed8' },
  interview: { bg: '#fef9c3', color: '#a16207' },
  offer:     { bg: '#dcfce7', color: '#15803d' },
  rejected:  { bg: '#fee2e2', color: '#b91c1c' },
}

const DARK_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  applied:   { bg: '#1e3a5f', color: '#93c5fd' },
  interview: { bg: '#3d2e00', color: '#fde68a' },
  offer:     { bg: '#14532d', color: '#86efac' },
  rejected:  { bg: '#450a0a', color: '#fca5a5' },
}

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

const badgeStyle = (status: string): CSSProperties => {
  const map = prefersDark() ? DARK_STATUS_COLORS : STATUS_COLORS
  const colors = map[status] ?? { bg: '#e5e7eb', color: '#374151' }
  return {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'capitalize',
    background: colors.bg,
    color: colors.color,
  }
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get<Job[]>('/jobs')
        const found = res.data.find(j => j.id === id)
        if (!found) {
          setError('Job not found.')
        } else {
          setJob(found)
        }
      } catch {
        setError('Failed to load job.')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  const handleStatusChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    if (!job) return
    const newStatus = e.target.value
    setStatusUpdating(true)
    try {
      await api.patch(`/jobs/${id}`, { status: newStatus })
      setJob(prev => prev ? { ...prev, status: newStatus } : prev)
    } catch {
      setError('Failed to update status.')
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this job application?')) return
    setDeleting(true)
    try {
      await api.delete(`/jobs/${id}`)
      navigate('/dashboard')
    } catch {
      setError('Failed to delete job.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={{ paddingTop: '80px' }}>
          <p style={styles.muted}>Loading…</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={{ paddingTop: '80px' }}>
          <p style={styles.error}>{error ?? 'Job not found.'}</p>
          <button style={styles.backButton} onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>← Back</button>

        <div style={styles.card}>
          {/* Title row */}
          <div style={styles.titleRow}>
            <div>
              <h1 style={styles.role}>{job.role}</h1>
              <p style={styles.company}>{job.company}</p>
            </div>
            <span style={badgeStyle(job.status)}>{job.status}</span>
          </div>

          {/* Details grid */}
          <div style={styles.grid}>
            <div style={styles.detailBlock}>
              <span style={styles.detailLabel}>Applied Date</span>
              <span style={styles.detailValue}>{job.applied_date}</span>
            </div>

            {job.url && (
              <div style={styles.detailBlock}>
                <span style={styles.detailLabel}>Job URL</span>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  {job.url}
                </a>
              </div>
            )}

            {job.notes && (
              <div style={{ ...styles.detailBlock, gridColumn: '1 / -1' }}>
                <span style={styles.detailLabel}>Notes</span>
                <span style={styles.detailValue}>{job.notes}</span>
              </div>
            )}
          </div>

          <hr style={styles.divider} />

          {/* Status change */}
          <div style={styles.actionRow}>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="status">Change Status</label>
              <select
                id="status"
                value={job.status}
                onChange={handleStatusChange}
                disabled={statusUpdating}
                style={styles.select}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                ))}
              </select>
            </div>

            <button
              style={styles.deleteButton}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>

          {error && <p style={{ ...styles.error, marginTop: '12px' }}>{error}</p>}
        </div>
      </div>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    padding: '0 24px 32px',
    boxSizing: 'border-box',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    paddingTop: '2rem',
  },
  backButton: {
    marginBottom: '20px',
    padding: '7px 16px',
    fontSize: '14px',
    fontWeight: 500,
    background: 'transparent',
    color: '#9a9aaa',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-block',
  },
  card: {
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    padding: '32px',
    boxShadow: 'rgba(0,0,0,0.5) 0 10px 15px -3px, rgba(0,0,0,0.3) 0 4px 6px -2px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  role: {
    margin: '0 0 4px',
    fontSize: '22px',
    fontWeight: 700,
    color: '#ffffff',
  },
  company: {
    margin: 0,
    fontSize: '15px',
    color: '#9a9aaa',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  detailBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#9a9aaa',
  },
  detailValue: {
    fontSize: '15px',
    color: '#ffffff',
  },
  link: {
    fontSize: '15px',
    color: '#b1361e',
    textDecoration: 'none',
    wordBreak: 'break-all',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #2a2a3a',
    margin: '0 0 24px',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#9a9aaa',
  },
  select: {
    padding: '9px 12px',
    fontSize: '14px',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    background: '#0a0a0f',
    color: '#ffffff',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  deleteButton: {
    padding: '9px 18px',
    fontSize: '14px',
    fontWeight: 600,
    background: '#b1361e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  muted: {
    color: '#9a9aaa',
    fontSize: '15px',
    textAlign: 'center',
    marginTop: '48px',
  },
  error: {
    margin: 0,
    fontSize: '14px',
    color: '#e53e3e',
  },
}

export default JobDetail
