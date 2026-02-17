import { Request, Response } from 'express'
import { CitasAdminService } from '../../services/admin/citas.service'
import {
  adminCitaSchema,
  adminCitaUpdateSchema
} from '../../schemas/admin/citas.schema'

export class CitasAdminController {

  static async getCitas(req: Request, res: Response) {
    try {
      const q = String(req.query.q || '')
      const data = await CitasAdminService.getCitas(q)
      res.json(data)
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createCita(req: Request, res: Response) {
    const parsed = adminCitaSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await CitasAdminService.createCita(parsed.data)
    res.status(201).json({ message: 'Cita creada' })
  }

  static async updateCita(req: Request, res: Response) {
    const parsed = adminCitaUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await CitasAdminService.updateCita(req.params.id, parsed.data)
    res.json({ message: 'Cita actualizada' })
  }

  static async deleteCita(req: Request, res: Response) {
    await CitasAdminService.deleteCita(req.params.id)
    res.status(204).send()
  }
}
