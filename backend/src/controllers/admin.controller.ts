import { Request, Response } from 'express'
import { AdminService } from '../services/admin.service'

export class AdminController {

  static async getUsuarios(req: Request, res: Response) {
    try {
      const q = String(req.query.q || '')
      const data = await AdminService.getUsuarios(q)
      res.json(data)
    } catch {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createUsuario(req: Request, res: Response) {
    try {
      await AdminService.createUsuario(req.body)
      res.status(201).json({ message: 'Creado' })
    } catch {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}
