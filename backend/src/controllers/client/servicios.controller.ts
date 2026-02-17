import { Request, Response } from 'express'
import { ServiciosService } from '../../services/client/servicios.service'

export class ServiciosController {
  static async getServicios(req: Request, res: Response) {
    try {
      const supabase = req.supabase!
      const servicios = await ServiciosService.getServicios(supabase)
      res.json(servicios)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }
}
