export interface Job {
  id: string
  user_id: string
  company: string
  role: string
  status: string
  applied_date: string
  url?: string
  notes?: string
  created_at: string
}

export interface StatusHistory {
  id: string
  job_id: string
  old_status: string
  new_status: string
  changed_at: string
}

export interface User {
  id: string
  email: string
}