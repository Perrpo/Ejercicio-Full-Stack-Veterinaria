import { Request, Response } from 'express';
import { PagoService } from '../../application/services/PagoService';
import { PagoEfectivo, PagoTarjeta, PagoTransferencia } from '../../domain/entities/payment/MetodosPago';

/**
 * PagoController - Controlador para gestionar pagos
 * Cumple con arquitectura limpia - solo orquesta llamadas a servicios
 */
export class PagoController {
  constructor(private pagoService: PagoService) {}

  async pagar(req: Request, res: Response) {
    try {
      const { citaId, metodo } = req.body;

      if (!citaId || !metodo) {
        return res.status(400).json({ error: 'citaId y metodo son requeridos' });
      }

      // Instanciar el método de pago según el tipo
      let metodoPago;
      switch (metodo.toLowerCase()) {
        case 'tarjeta':
          metodoPago = new PagoTarjeta();
          break;
        case 'efectivo':
          metodoPago = new PagoEfectivo();
          break;
        case 'transferencia':
          metodoPago = new PagoTransferencia();
          break;
        default:
          return res.status(400).json({ error: 'Método de pago no válido' });
      }

      const pago = await this.pagoService.procesarPago(citaId, metodoPago);

      res.status(201).json({
        mensaje: 'Pago procesado exitosamente',
        pago: {
          id: pago.id,
          monto: pago.obtenerMonto(),
          estado: pago.obtenerEstado(),
          metodo: pago.metodo.obtenerTipo(),
        },
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async obtenerHistorial(req: Request, res: Response) {
    try {
      const { citaId } = req.params;

      const pagos = await this.pagoService.obtenerPagosDeCita(citaId);

      res.json({
        citaId,
        pagos: pagos.map((p) => ({
          id: p.id,
          monto: p.obtenerMonto(),
          estado: p.obtenerEstado(),
          metodo: p.metodo.obtenerTipo(),
        })),
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async verificarPago(req: Request, res: Response) {
    try {
      const { pagoId } = req.params;

      const aprobado = await this.pagoService.verificarPagoAprobado(pagoId);

      res.json({
        pagoId,
        aprobado,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
