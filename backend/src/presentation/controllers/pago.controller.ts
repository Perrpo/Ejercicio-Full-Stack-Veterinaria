/**
 * PRESENTATION LAYER - PagoController
 * Controlador HTTP para gestión de Pagos
 */

import { Request, Response } from 'express'
import { PagoService } from '../../application/services'

export class PagoController {
  private pagoService = new PagoService()

  async crearPago(req: Request, res: Response) {
    try {
      const { id_cita, metodo_pago, monto } = req.body

      if (!id_cita || !metodo_pago || !monto) {
        return res.status(400).json({
          error: 'Faltan campos requeridos: id_cita, metodo_pago, monto'
        })
      }

      const pago = await this.pagoService.crearPago({
        id_cita,
        metodo_pago,
        monto
      })

      res.status(201).json(pago)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async obtenerPago(req: Request, res: Response) {
    try {
      const { id } = req.params
      const pago = await this.pagoService.obtenerPago(parseInt(id))

      if (!pago) {
        return res.status(404).json({ error: 'Pago no encontrado' })
      }

      res.json(pago)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async obtenerPagosCita(req: Request, res: Response) {
    try {
      const { citaId } = req.params
      const pagos = await this.pagoService.obtenerPagosCita(parseInt(citaId))
      res.json(pagos)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async obtenerTodosPagos(req: Request, res: Response) {
    try {
      const pagos = await this.pagoService.obtenerTodosPagos()
      res.json(pagos)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }

  async confirmarPago(req: Request, res: Response) {
    try {
      const { id } = req.params
      const pagoActualizado = await this.pagoService.confirmarPago(parseInt(id))
      res.json(pagoActualizado)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async rechazarPago(req: Request, res: Response) {
    try {
      const { id } = req.params
      const pagoActualizado = await this.pagoService.rechazarPago(parseInt(id))
      res.json(pagoActualizado)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async actualizarPago(req: Request, res: Response) {
    try {
      const { id } = req.params
      const datos = req.body

      const pagoActualizado = await this.pagoService.actualizarPago(parseInt(id), datos)
      res.json(pagoActualizado)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async eliminarPago(req: Request, res: Response) {
    try {
      const { id } = req.params
      await this.pagoService.eliminarPago(parseInt(id))
      res.status(204).send()
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
