/**
 * PRESENTATION LAYER - CitaController
 * Controlador HTTP para gestión de Citas
 */

import { Request, Response } from 'express'
import { CitaService } from '../../application/services'

export class CitaController {
  constructor(private citaService: CitaService = new CitaService()) {}

  async crearCita(req: Request, res: Response) {
    try {
      const { id_usuario, id_paciente, id_servicio, fecha_cita, motivo } = req.body

      if (!id_paciente || !id_servicio || !fecha_cita) {
        return res.status(400).json({
          error: 'Faltan campos requeridos: id_paciente, id_servicio, fecha_cita'
        })
      }

      const cita = await this.citaService.crearCita({
        id_usuario: id_usuario || (req as any).user?.id,
        id_paciente,
        id_servicio,
        fecha_cita,
        motivo: motivo || ''
      })

      res.status(201).json(cita)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async obtenerCita(req: Request, res: Response) {
    try {
      const { id } = req.params
      const cita = await this.citaService.obtenerTodasLasCitas()
      const citaEspecifica = cita.find((c: any) => c.id === parseInt(id))

      if (!citaEspecifica) {
        return res.status(404).json({ error: 'Cita no encontrada' })
      }

      res.json(citaEspecifica)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async obtenerTodasCitas(req: Request, res: Response) {
    try {
      const { filtro } = req.query
      const citas = await this.citaService.obtenerTodasLasCitas(
        filtro ? String(filtro) : undefined
      )
      res.json(citas)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async confirmarCita(req: Request, res: Response) {
    try {
      const { id } = req.params
      const citaActualizada = await this.citaService.confirmarCita(parseInt(id))
      res.json(citaActualizada)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async cancelarCita(req: Request, res: Response) {
    try {
      const { id } = req.params
      const citaActualizada = await this.citaService.cancelarCita(parseInt(id))
      res.json(citaActualizada)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async finalizarCita(req: Request, res: Response) {
    try {
      const { id } = req.params
      const citaActualizada = await this.citaService.finalizarCita(parseInt(id))
      res.json(citaActualizada)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async actualizarCita(req: Request, res: Response) {
    try {
      const { id } = req.params
      const datos = req.body

      const citaActualizada = await this.citaService.actualizarCita(parseInt(id), datos)
      res.json(citaActualizada)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async eliminarCita(req: Request, res: Response) {
    try {
      const { id } = req.params
      await this.citaService.eliminarCita(parseInt(id))
      res.status(204).send()
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
