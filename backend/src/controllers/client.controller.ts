import { Request, Response } from 'express'
import { ClientService } from '../services/client.service'
import { createMascotaSchema } from '../schemas/client.schemas'

export class ClientController {
  
  // ======================
  // Dashboard
  // ======================
  static async dashboard(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const data = await ClientService.getDashboard(userId, supabase)
      res.json(data)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }

  // ======================
  // Perfil
  // ======================
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const perfil = await ClientService.getProfile(userId, supabase)
      res.json(perfil)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      await ClientService.updateProfile(userId, req.body, supabase)
      res.json({ message: 'Perfil actualizado exitosamente' })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  // ======================
  // Mascotas / Pacientes
  // ======================
  static async getMascotas(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id_usuario', userId)
      if (error) throw error
      res.json(data)
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
      const id = await ClientService.createMascota(userId, parsed.data, supabase)
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
      await ClientService.deleteMascota(userId, petId, supabase)
      res.json({ message: 'Mascota eliminada exitosamente' })
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  // ======================
  // Citas
  // ======================
  static async getCitas(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const citas = await ClientService.getCitas(userId, supabase)
      res.json(citas)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  static async createCita(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const citaData = req.body
      const cita = await ClientService.createCita(userId, citaData, supabase)
      res.status(201).json(cita)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  // ======================
  // Servicios
  // ======================
  static async getServicios(req: Request, res: Response) {
    try {
      const supabase = req.supabase!
      const { data: servicios, error } = await supabase
        .from('servicios')
        .select('id_servicio, nombre, precio')
        .order('nombre', { ascending: true })
      if (error) throw error

      const serviciosFormateados = (servicios || []).map((servicio: any) => ({
        ...servicio,
        precio_formateado: servicio.precio.toLocaleString('es-CO'),
      }))
      res.json(serviciosFormateados)
    } catch (error) {
      res.status(500).json({ message: (error as Error).message })
    }
  }

  // ======================
  // Examenes
  // ======================
  static async getExamenes(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const examenes = await ClientService.getExamenes(userId, supabase)
      res.json(examenes)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }

  static async createExamen(req: Request, res: Response) {
    try {
      const userId = req.user!.sub
      const supabase = req.supabase!
      const examenData = req.body
      const examen = await ClientService.createExamen(userId, examenData, supabase)
      res.status(201).json(examen)
    } catch (error) {
      res.status(400).json({ message: (error as Error).message })
    }
  }
}
