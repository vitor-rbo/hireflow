import { useState, useEffect } from 'react'
import type { FormEvent, ChangeEvent, CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
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
    padding: '2px 10px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'capitalize',
    background: colors.bg,
    color: colors.color,
  }
}

interface JobForm {
  company: string
  role: string
  status: string
  applied_date: string
  url: string
  notes: string
}

const EMPTY_FORM: JobForm = {
  company: '',
  role: '',
  status: 'applied',
  applied_date: '',
  url: '',
  notes: '',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<JobForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      const res = await api.get<Job[]>('/jobs')
      setJobs(res.data)
    } catch {
      setError('Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAddJob = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      await api.post('/jobs', form)
      setShowModal(false)
      setForm(EMPTY_FORM)
      await fetchJobs()
    } catch {
      setFormError('Failed to add job. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={{ height: '80px' }} />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.heading}>My Applications</h1>
          <div style={styles.headerActions}>
            <button style={styles.addButton} onClick={() => setShowModal(true)}>
              + Add Job
            </button>
          </div>
        </div>

        {/* Job list */}
        {loading && <p style={styles.muted}>Loading…</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p style={styles.muted}>No applications yet. Add your first job!</p>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['Company', 'Role', 'Status', 'Applied Date', ''].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} style={styles.tr}>
                    <td style={styles.td}>{job.company}</td>
                    <td style={styles.td}>{job.role}</td>
                    <td style={styles.td}>
                      <span style={badgeStyle(job.status)}>{job.status}</span>
                    </td>
                    <td style={styles.td}>{job.applied_date}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.viewButton}
                        onClick={() => navigate(`/jobs/${job.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Add Job</h2>
            <form onSubmit={handleAddJob} style={styles.form}>
              {([
                { name: 'company', label: 'Company', type: 'text', placeholder: 'Acme Inc.' },
                { name: 'role',    label: 'Role',    type: 'text', placeholder: 'Software Engineer' },
                { name: 'applied_date', label: 'Applied Date', type: 'date', placeholder: '' },
                { name: 'url',     label: 'Job URL', type: 'url',  placeholder: 'https://…' },
              ] as const).map(({ name, label, type, placeholder }) => (
                <div key={name} style={styles.field}>
                  <label style={styles.label} htmlFor={name}>{label}</label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleFormChange}
                    required={name === 'company' || name === 'role' || name === 'applied_date'}
                    style={styles.input}
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div style={styles.field}>
                <label style={styles.label} htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  style={styles.input}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label} htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows={3}
                  style={{ ...styles.input, resize: 'vertical' }}
                  placeholder="Optional notes…"
                />
              </div>

              {formError && <p style={styles.error}>{formError}</p>}

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => { setShowModal(false); setForm(EMPTY_FORM) }}
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={styles.addButton}>
                  {submitting ? 'Adding…' : 'Add Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0f',
    boxSizing: 'border-box',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 24px 32px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  heading: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 700,
    color: '#ffffff',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
  },
  addButton: {
    padding: '9px 18px',
    fontSize: '14px',
    fontWeight: 600,
    background: '#b1361e',
    color: '#fff',
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
  tableWrapper: {
    overflowX: 'auto',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 600,
    color: '#9a9aaa',
    borderBottom: '1px solid #2a2a3a',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #2a2a3a',
  },
  td: {
    padding: '12px 16px',
    color: '#ffffff',
    verticalAlign: 'middle',
  },
  viewButton: {
    padding: '5px 14px',
    fontSize: '13px',
    fontWeight: 500,
    background: 'transparent',
    color: '#b1361e',
    border: '1px solid #b1361e',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 100,
  },
  modal: {
    width: '100%',
    maxWidth: '480px',
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    padding: '36px 32px',
    boxShadow: 'rgba(0,0,0,0.5) 0 10px 15px -3px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    margin: '0 0 24px',
    fontSize: '20px',
    fontWeight: 700,
    color: '#ffffff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
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
    textAlign: 'left',
  },
  input: {
    padding: '9px 12px',
    fontSize: '14px',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    background: '#0a0a0f',
    color: '#ffffff',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '9px 18px',
    fontSize: '14px',
    fontWeight: 500,
    background: 'transparent',
    color: '#9a9aaa',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    cursor: 'pointer',
  },
}

export default Dashboard
