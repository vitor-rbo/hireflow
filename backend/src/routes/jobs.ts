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

// Update a job
router.patch('/:id', authenticate, async (req, res) => {
  const { user } = req as unknown as AuthRequest
  const token = req.headers.authorization!.split(' ')[1]
  const supabase = supabaseWithToken(token)
  const { id } = req.params
  const updates = req.body

  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()

  if (error) return res.status(400).json({ error })
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