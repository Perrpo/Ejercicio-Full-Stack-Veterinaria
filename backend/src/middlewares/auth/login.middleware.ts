import { Request, Response, NextFunction } from 'express'
import { loginSchema } from '../../schemas/auth/login.schema'

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() })
  }
  next()
}
