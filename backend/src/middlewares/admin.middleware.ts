import { Request, Response, NextFunction } from 'express'

export function authAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ message: 'Requiere rol admin' })
  }
  next()
}
