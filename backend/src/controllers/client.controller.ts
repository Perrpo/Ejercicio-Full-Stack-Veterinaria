import { Request, Response } from 'express'
import { ClientService } from '../services/client.service'
import { createMascotaSchema } from '../schemas/client.schemas'

export class ClientController {
  static async dashboard(req: Request, res: Response) {
    const userId = req.user!.sub
    const supabase = req.supabase!

    const data = await ClientService.getDashboard(userId, supabase)
    res.json(data)
  }

  static async createMascota(req: Request, res: Response) {
    const parsed = createMascotaSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    const userId = req.user!.sub
    const supabase = req.supabase!

    const id = await ClientService.createMascota(userId, parsed.data, supabase)
    res.status(201).json({ message: 'Mascota creada', id })
  }

  static async getProfile(req: Request, res: Response) {
  const userId = req.user!.sub
  const supabase = req.supabase!

  const perfil = await ClientService.getProfile(userId, supabase)
  res.json(perfil)
}

static async updateProfile(req: Request, res: Response) {
  const userId = req.user!.sub
  const supabase = req.supabase!

  await ClientService.updateProfile(userId, req.body, supabase)
  res.json({ message: 'Perfil actualizado exitosamente' })
}


}
