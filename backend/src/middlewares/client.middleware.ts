import { Request, Response, NextFunction } from 'express'

export function authCliente(req: Request, res: Response, next: NextFunction) {
  if (req.user?.rol !== 'cliente') {
    return res.status(403).json({ message: 'Acceso denegado' })
  }
  next()
}
