import { Request, Response } from 'express'
import { UsuariosAdminService } from '../../services/admin/usuarios.service'
import {
  adminUserSchema,
  adminUserUpdateSchema
} from '../../schemas/admin/usuarios.schema'

export class UsuariosAdminController {

  static async getUsuarios(req: Request, res: Response) {
    try {
      const q = String(req.query.q || '')
      const data = await UsuariosAdminService.getUsuarios(q)
      res.json(data)
    } catch {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createUsuario(req: Request, res: Response) {
    const parsed = adminUserSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await UsuariosAdminService.createUsuario(parsed.data)
    res.status(201).json({ message: 'Creado' })
  }

  static async updateUsuario(req: Request, res: Response) {
    const parsed = adminUserUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await UsuariosAdminService.updateUsuario(req.params.id, parsed.data)
    res.json({ message: 'Actualizado' })
  }

  static async deleteUsuario(req: Request, res: Response) {
    await UsuariosAdminService.deleteUsuario(req.params.id)
    res.json({ message: 'Eliminado' })
  }
}
