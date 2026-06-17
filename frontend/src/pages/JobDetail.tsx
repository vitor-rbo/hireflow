import { useState, useEffect } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import type { Job, StatusHistory } from '../types'
import Navbar from '../components/Navbar'
import { useToast } from '../context/ToastContext'

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

interface EditForm {
  company: string
  role: string
  applied_date: string
  url: string
  notes: string
  status: string
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get<Job[]>('/jobs')
        const found = res.data.find(j => j.id === id)
        if (!found) {
          setNotFound(true)
        } else {
          setJob(found)
          try {
            const history = await api.get<StatusHistory[]>(`/jobs/${id}/history`)
            setStatusHistory(history.data)
          } catch (err) {
            console.error('Failed to load status history:', err)
          }
        }
      } catch {
        showToast('Failed to load job.', 'error')
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
      showToast('Failed to update status.', 'error')
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this job application?')) return
    setDeleting(true)
    try {
      await api.delete(`/jobs/${id}`)
      showToast('Job deleted successfully.', 'success')
      navigate('/dashboard')
    } catch {
      showToast('Failed to delete job.', 'error')
      setDeleting(false)
    }
  }

  const handleEditStart = () => {
    if (!job) return
    setEditForm({
      company: job.company,
      role: job.role,
      applied_date: job.applied_date,
      url: job.url ?? '',
      notes: job.notes ?? '',
      status: job.status,
    })
    setEditing(true)
  }

  const handleEditCancel = () => {
    setEditing(false)
    setEditForm(null)
  }

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setEditForm(prev => prev ? { ...prev, [e.target.name]: e.target.value } : prev)
  }

  const handleEditSave = async () => {
    if (!editForm) return
    setSaving(true)
    try {
      await api.patch(`/jobs/${id}`, editForm)
      setJob(prev => prev ? { ...prev, ...editForm } : prev)
      setEditing(false)
      setEditForm(null)
      showToast('Job updated successfully.', 'success')
    } catch {
      showToast('Failed to save changes.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <p style={styles.muted}>Loading…</p>
      </div>
    )
  }

  if (notFound || !job) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.container}>
          <p style={styles.muted}>Job not found.</p>
          <button style={styles.backButton} onClick={() => navigate('/dashboard')}>← Back</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <button style={styles.backButton} onClick={() => navigate('/dashboard')}>← Back</button>

        <div style={styles.card}>
          {editing && editForm ? (
            <>
              <div style={styles.editGrid} className="edit-grid">
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="role">Role</label>
                  <input
                    id="role"
                    name="role"
                    type="text"
                    value={editForm.role}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    value={editForm.company}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="applied_date">Applied Date</label>
                  <input
                    id="applied_date"
                    name="applied_date"
                    type="date"
                    value={editForm.applied_date}
                    onChange={handleEditChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="url">Job URL</label>
                  <input
                    id="url"
                    name="url"
                    type="url"
                    value={editForm.url}
                    onChange={handleEditChange}
                    style={styles.input}
                    placeholder="https://…"
                  />
                </div>
                <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                  <label style={styles.label} htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditChange}
                    rows={3}
                    style={{ ...styles.input, resize: 'vertical' }}
                    placeholder="Optional notes…"
                  />
                </div>
              </div>

              <hr style={styles.divider} />

              <div style={styles.actionRow} className="action-row">
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    style={styles.select}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.editActions} className="detail-edit-actions">
                  <button style={styles.cancelButton} onClick={handleEditCancel} disabled={saving}>
                    Cancel
                  </button>
                  <button style={styles.saveButton} onClick={handleEditSave} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>

            </>
          ) : (
            <>
              <div style={styles.titleRow}>
                <div>
                  <h1 style={styles.role}>{job.role}</h1>
                  <p style={styles.company}>{job.company}</p>
                </div>
                <span style={badgeStyle(job.status)}>{job.status}</span>
              </div>

              <div style={styles.grid} className="detail-grid">
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

              <div style={styles.actionRow} className="action-row">
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

                <div style={styles.editActions} className="detail-edit-actions">
                  <button style={styles.editButton} onClick={handleEditStart}>
                    Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>

            </>
          )}
        </div>

        <div style={{ ...styles.card, marginTop: '24px' }}>
          <h2 style={styles.timelineHeading}>Application Timeline</h2>

          {statusHistory.length === 0 ? (
            <p style={styles.timelineEmpty}>No status changes recorded yet.</p>
          ) : (
            <div style={styles.timeline}>
              {statusHistory.map((entry, i) => {
                const dotColor = DARK_STATUS_COLORS[entry.new_status]?.color ?? '#9a9aaa'
                const isLast = i === statusHistory.length - 1
                const date = new Date(entry.changed_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })
                return (
                  <div key={entry.id} style={styles.timelineItem}>
                    <div style={styles.timelineLeft}>
                      <div style={{ ...styles.timelineDot, background: dotColor }} />
                      {!isLast && <div style={styles.timelineLine} />}
                    </div>
                    <div style={{ ...styles.timelineContent, paddingBottom: isLast ? 0 : '20px' }}>
                      <span style={styles.timelineChange}>
                        <span style={{ textTransform: 'capitalize' }}>{entry.old_status}</span>
                        {' → '}
                        <span style={{ textTransform: 'capitalize' }}>{entry.new_status}</span>
                      </span>
                      <span style={styles.timelineDate}>{date}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
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
    maxWidth: '680px',
    margin: '0 auto',
    padding: '2rem 24px 32px',
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
  editGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
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
  editActions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
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
  editButton: {
    padding: '9px 18px',
    fontSize: '14px',
    fontWeight: 600,
    background: 'transparent',
    color: '#ffffff',
    border: '1px solid #2a2a3a',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '9px 18px',
    fontSize: '14px',
    fontWeight: 600,
    background: '#b1361e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
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
  timelineHeading: {
    margin: '0 0 20px',
    fontSize: '16px',
    fontWeight: 600,
    color: '#ffffff',
  },
  timelineEmpty: {
    margin: 0,
    fontSize: '14px',
    color: '#9a9aaa',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  timelineItem: {
    display: 'flex',
    gap: '14px',
  },
  timelineLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '12px',
    flexShrink: 0,
  },
  timelineDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '3px',
  },
  timelineLine: {
    width: '2px',
    flex: 1,
    background: '#2a2a3a',
    marginTop: '4px',
    minHeight: '12px',
  },
  timelineContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
    gap: '12px',
  },
  timelineChange: {
    fontSize: '14px',
    color: '#ffffff',
  },
  timelineDate: {
    fontSize: '13px',
    color: '#9a9aaa',
    whiteSpace: 'nowrap',
  },
}

export default JobDetail
