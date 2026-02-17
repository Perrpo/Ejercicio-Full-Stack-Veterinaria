import { Request, Response } from 'express'
import { ExamenesAdminService } from '../../services/admin/examenes.service'
import {
  adminExamenSchema,
  adminExamenUpdateSchema
} from '../../schemas/admin/examenes.schema'

export class ExamenesAdminController {

  static async getExamenes(req: Request, res: Response) {
    try {
      const q = String(req.query.q || '')
      const data = await ExamenesAdminService.getExamenes(q)
      res.json(data)
    } catch {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createExamen(req: Request, res: Response) {
    const parsed = adminExamenSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await ExamenesAdminService.createExamen(parsed.data)
    res.status(201).json({ message: 'Examen creado' })
  }

  static async updateExamen(req: Request, res: Response) {
    const parsed = adminExamenUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await ExamenesAdminService.updateExamen(req.params.id, parsed.data)
    res.json({ message: 'Examen actualizado' })
  }

  static async deleteExamen(req: Request, res: Response) {
    await ExamenesAdminService.deleteExamen(req.params.id)
    res.status(204).send()
  }
}
