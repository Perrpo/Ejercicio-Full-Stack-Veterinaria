import { Request, Response } from 'express'
import { ExamenesService } from '../../services/client/examenes.service'
import { createExamenSchema } from '../../schemas/client/examenes.schema'

export class ExamenesController {
  static async getExamenes(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const examenes = await ExamenesService.getExamenes(userId, supabase)
      res.json(examenes)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  static async createExamen(req: Request, res: Response) {
    try {
      const parsed = createExamenSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() })
      }

      const userId = req.user!.sub
      const supabase = req.supabase!
      const examen = await ExamenesService.createExamen(userId, parsed.data, supabase)
      res.status(201).json(examen)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}
