import { Request, Response } from 'express'
import { PacientesAdminService } from '../../services/admin/pacientes.service'
import {
  adminPacienteSchema,
  adminPacienteUpdateSchema
} from '../../schemas/admin/pacientes.schema'

export class PacientesAdminController {

  static async getPacientes(req: Request, res: Response) {
    try {
      const q = String(req.query.q || '')
      const data = await PacientesAdminService.getPacientes(q)
      res.json(data)
    } catch {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }

  static async createPaciente(req: Request, res: Response) {
    const parsed = adminPacienteSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await PacientesAdminService.createPaciente(parsed.data)
    res.status(201).json({ message: 'Paciente creado' })
  }

  static async updatePaciente(req: Request, res: Response) {
    const parsed = adminPacienteUpdateSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.flatten() })
    }

    await PacientesAdminService.updatePaciente(req.params.id, parsed.data)
    res.json({ message: 'Paciente actualizado' })
  }

  static async deletePaciente(req: Request, res: Response) {
    await PacientesAdminService.deletePaciente(req.params.id)
    res.status(204).send()
  }
}
