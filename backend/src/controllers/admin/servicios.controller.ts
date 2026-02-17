import { Request, Response } from 'express'
import { ServiciosAdminService } from '../../services/admin/servicios.service'
import {
  adminServicioSchema,
  adminServicioUpdateSchema
} from '../../schemas/admin/servicios.schema'

export class ServiciosAdminController {

  static async getServicios(req: Request, res: Response) {
    try {
      const q = String(req.query.q || '')
      const data = await ServiciosAdminService.getServicios(q)
      res.json(data)
    } catch {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createServicio(req: Request, res: Response) {
    const parsed = adminServicioSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await ServiciosAdminService.createServicio(parsed.data)
    res.status(201).json({ message: 'Servicio creado' })
  }

  static async updateServicio(req: Request, res: Response) {
    const parsed = adminServicioUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await ServiciosAdminService.updateServicio(req.params.id, parsed.data)
    res.json({ message: 'Servicio actualizado' })
  }

  static async deleteServicio(req: Request, res: Response) {
    await ServiciosAdminService.deleteServicio(req.params.id)
    res.status(204).send()
  }
}
