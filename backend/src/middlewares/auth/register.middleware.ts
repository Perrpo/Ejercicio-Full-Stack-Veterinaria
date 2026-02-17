import { Request, Response, NextFunction } from 'express'
import { registerSchema } from '../../schemas/auth/register.schema'

export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() })
  }
  next()
}
