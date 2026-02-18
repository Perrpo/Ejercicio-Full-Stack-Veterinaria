import { IProcesadorPago } from './IProcesadorPago';
import { Pago } from '../../domain/entities/Pago';
import { EstadoPago } from '../../domain/enums/EstadoPago';

/**
 * ProcesadorPagoReal - Implementación concreta del procesador de pagos
 * Cumple con SRP (Single Responsibility Principle) - solo procesa pagos
 */
export class ProcesadorPagoReal implements IProcesadorPago {
  async procesar(pago: Pago): Promise<boolean> {
    try {
      const resultado = await pago.metodo.procesar(pago.obtenerMonto());

      if (resultado) {
        pago.cambiarEstado(EstadoPago.PAGADO);
        return true;
      } else {
        pago.cambiarEstado(EstadoPago.RECHAZADO);
        return false;
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      pago.cambiarEstado(EstadoPago.RECHAZADO);
      return false;
    }
  }

  estaAprobado(pago: Pago): boolean {
    return pago.estaPagado();
  }
}
