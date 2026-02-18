import { Request, Response } from 'express'
import { AdminService } from '../services/admin.service'
import { adminCitaSchema, adminCitaUpdateSchema, adminExamenSchema, adminExamenUpdateSchema, adminPacienteSchema, adminPacienteUpdateSchema, adminPagoSchema, adminPagoUpdateSchema, adminServicioSchema, adminServicioUpdateSchema, adminUserSchema } from '../schemas/adminUser.schema'

export class AdminController {

  static async getUsuarios(req: Request, res: Response) {
    try {
      const q = String(req.query.q || '')
      const data = await AdminService.getUsuarios(q)
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

    await AdminService.createUsuario(parsed.data)
    res.status(201).json({ message: 'Creado' })
  }

  static async updateUsuario(req: Request, res: Response) {
  const id = String(req.params.id)

  const parsed = adminUserSchema
    .partial({ email: true, rol: true })
    .safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() })
  }

  await AdminService.updateUsuario(id, parsed.data)
  res.json({ message: 'Actualizado' })
}

static async deleteUsuario(req: Request, res: Response) {
  const id = String(req.params.id)
  await AdminService.deleteUsuario(id)
  res.json({ message: 'Eliminado' })
}

  // ======================
  // PACIENTES
  // ======================

  static async getPacientes(req: Request, res: Response) {
    const q = String(req.query.q || '')
    const data = await AdminService.getPacientes(q)
    res.json(data)
  }

  static async createPaciente(req: Request, res: Response) {
    const data = adminPacienteSchema.parse(req.body)
    await AdminService.createPaciente(data)
    res.status(201).json({ message: 'Paciente creado' })
  }

  static async updatePaciente(req: Request, res: Response) {
    const data = adminPacienteUpdateSchema.parse(req.body)
    await AdminService.updatePaciente(req.params.id, data)
    res.json({ message: 'Paciente actualizado' })
  }

  static async deletePaciente(req: Request, res: Response) {
    await AdminService.deletePaciente(req.params.id)
    res.status(204).send()
  }

  // ======================
  // CITAS
  // ======================

  static async getCitas(req: Request, res: Response) {
    const q = String(req.query.q || '')
    const data = await AdminService.getCitas(q)
    res.json(data)
  }

  static async createCita(req: Request, res: Response) {
    const data = adminCitaSchema.parse(req.body)
    await AdminService.createCita(data)
    res.status(201).json({ message: 'Cita creada' })
  }

  static async updateCita(req: Request, res: Response) {
    const data = adminCitaUpdateSchema.parse(req.body)
    await AdminService.updateCita(req.params.id, data)
    res.json({ message: 'Cita actualizada' })
  }

  static async deleteCita(req: Request, res: Response) {
    await AdminService.deleteCita(req.params.id)
    res.status(204).send()
  }

  // ======================
  // EXÁMENES
  // ======================

  static async getExamenes(req: Request, res: Response) {
    const q = String(req.query.q || '')
    const data = await AdminService.getExamenes(q)
    res.json(data)
  }

  static async createExamen(req: Request, res: Response) {
    const data = adminExamenSchema.parse(req.body)
    await AdminService.createExamen(data)
    res.status(201).json({ message: 'Examen creado' })
  }

  static async updateExamen(req: Request, res: Response) {
    const data = adminExamenUpdateSchema.parse(req.body)
    await AdminService.updateExamen(req.params.id, data)
    res.json({ message: 'Examen actualizado' })
  }

  static async deleteExamen(req: Request, res: Response) {
    await AdminService.deleteExamen(req.params.id)
    res.status(204).send()
  }

  // ======================
  // SERVICIOS
  // ======================

  static async getServicios(req: Request, res: Response) {
    const q = String(req.query.q || '')
    const data = await AdminService.getServicios(q)
    res.json(data)
  }

  static async createServicio(req: Request, res: Response) {
    const data = adminServicioSchema.parse(req.body)
    await AdminService.createServicio(data)
    res.status(201).json({ message: 'Servicio creado' })
  }

  static async updateServicio(req: Request, res: Response) {
    const data = adminServicioUpdateSchema.parse(req.body)
    await AdminService.updateServicio(req.params.id, data)
    res.json({ message: 'Servicio actualizado' })
  }

  static async deleteServicio(req: Request, res: Response) {
    await AdminService.deleteServicio(req.params.id)
    res.status(204).send()
  }

  // ======================
  // PAGOS
  // ======================

  static async getPagos(req: Request, res: Response) {
    const q = String(req.query.q || '')
    const data = await AdminService.getPagos(q)
    res.json(data)
  }

  static async createPago(req: Request, res: Response) {
    const data = adminPagoSchema.parse(req.body)
    const id = await AdminService.createPago(data)
    res.status(201).json({ message: 'Pago creado', id })
  }

  static async updatePago(req: Request, res: Response) {
    const data = adminPagoUpdateSchema.parse(req.body)
    await AdminService.updatePago(req.params.id, data)
    res.json({ message: 'Pago actualizado' })
  }

  static async deletePago(req: Request, res: Response) {
    await AdminService.deletePago(req.params.id)
    res.status(204).send()
  }

}
