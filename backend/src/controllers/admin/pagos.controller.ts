import { Request, Response } from 'express'
import { PagosAdminService } from '../../services/admin/pagos.service'
import { adminPagoSchema } from '../../schemas/admin/pagos.schema'

export class PagosAdminController {

  static async getPagos(req: Request, res: Response) {
    try {
      const data = await PagosAdminService.getPagos()
      res.json(data)
    } catch {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createPago(req: Request, res: Response) {
    const parsed = adminPagoSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await PagosAdminService.createPago(parsed.data)
    res.status(201).json({ message: 'Pago registrado' })
  }

  static async deletePago(req: Request, res: Response) {
    await PagosAdminService.deletePago(req.params.id)
    res.status(204).send()
  }
}
