import { Request, Response } from 'express'
import { MascotasService } from '../../services/client/mascotas.service'
import { createMascotaSchema } from '../../schemas/client/mascotas.schema'

export class MascotasController {
  static async getMascotas(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const mascotas = await MascotasService.getMascotas(userId, supabase)
      res.json(mascotas)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }

  static async createMascota(req: Request, res: Response) {
    try {
      const parsed = createMascotaSchema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() })
      }

      const userId = req.user!.sub
      const supabase = req.supabase!
      const id = await MascotasService.createMascota(userId, parsed.data, supabase)
      res.status(201).json({ message: 'Mascota creada', id })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  static async deleteMascota(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const petId = Number(req.params.id)
      const supabase = req.supabase!
      await MascotasService.deleteMascota(userId, petId, supabase)
      res.json({ message: 'Mascota eliminada exitosamente' })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}
