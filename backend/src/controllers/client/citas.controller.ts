import { Request, Response } from 'express'
import { CitasService } from '../../services/client/citas.service'
import { createCitaSchema } from '../../schemas/client/citas.schema'

export class CitasController {
  static async getCitas(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const citas = await CitasService.getCitas(userId, supabase)
      res.json(citas)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  static async createCita(req: Request, res: Response) {
    try {
      const parsed = createCitaSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() })
      }

      const userId = req.user!.sub
      const supabase = req.supabase!
      const cita = await CitasService.createCita(userId, parsed.data, supabase)
      res.status(201).json(cita)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}
