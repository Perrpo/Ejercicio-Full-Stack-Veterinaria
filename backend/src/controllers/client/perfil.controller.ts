import { Request, Response } from 'express'
import { PerfilService } from '../../services/client/perfil.service'
import { updateProfileSchema } from '../../schemas/client/perfil.schema'

export class PerfilController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const perfil = await PerfilService.getProfile(userId, supabase)
      res.json(perfil)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const parsed = updateProfileSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() })
      }

      const userId = req.user!.sub
      const supabase = req.supabase!
      await PerfilService.updateProfile(userId, parsed.data, supabase)
      res.json({ message: 'Perfil actualizado exitosamente' })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}
