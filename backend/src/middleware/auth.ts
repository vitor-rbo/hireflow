import { Request, Response, NextFunction } from 'express'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface AuthRequest extends Request {
  user: User
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  (req as AuthRequest).user = data.user
  next()
}