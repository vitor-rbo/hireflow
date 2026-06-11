import { Router } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth'
import { supabaseWithToken } from '../lib/supabase'

const router = Router()

// Get all jobs for the logged in user
router.get('/', authenticate, async (req, res) => {
  const { user } = req as unknown as AuthRequest
  const token = req.headers.authorization!.split(' ')[1]
  const supabase = supabaseWithToken(token)

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error })
  res.json(data)
})

// Add a new job
router.post('/', authenticate, async (req, res) => {
  const { user } = req as unknown as AuthRequest
  const token = req.headers.authorization!.split(' ')[1]
  const supabase = supabaseWithToken(token)
  const { company, role, status, applied_date, url, notes } = req.body

  const { data, error } = await supabase
    .from('jobs')
    .insert([{ company, role, status, applied_date, url, notes, user_id: user.id }])
    .select()

  if (error) return res.status(400).json({ error })
  res.status(201).json(data[0])
})

// Get status history for a job
router.get('/:id/history', authenticate, async (req, res) => {
  const token = req.headers.authorization!.split(' ')[1]
  const supabase = supabaseWithToken(token)
  const { id } = req.params

  const { data, error } = await supabase
    .from('status_history')
    .select('*')
    .eq('job_id', id)
    .order('changed_at', { ascending: true })

  if (error) return res.status(400).json({ error })
  res.json(data)
})

// Update a job
router.patch('/:id', authenticate, async (req, res) => {
  const { user } = req as unknown as AuthRequest
  const token = req.headers.authorization!.split(' ')[1]
  const supabase = supabaseWithToken(token)
  const { id } = req.params
  const updates = req.body

  // Fetch current job to get existing status before applying updates
  const { data: current, error: fetchError } = await supabase
    .from('jobs')
    .select('status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !current) return res.status(404).json({ error: 'Job not found' })

  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()

  if (error) return res.status(400).json({ error })

  if (updates.status && updates.status !== current.status) {
    const { error: historyError } = await supabase.from('status_history').insert({
      job_id: id,
      old_status: current.status,
      new_status: updates.status,
    })
    if (historyError) console.error('Failed to record status history:', historyError)
  }

  res.json(data[0])
})

// Delete a job
router.delete('/:id', authenticate, async (req, res) => {
  const { user } = req as unknown as AuthRequest
  const token = req.headers.authorization!.split(' ')[1]
  const supabase = supabaseWithToken(token)
  const { id } = req.params

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return res.status(400).json({ error })
  res.status(204).send()
})

export default router