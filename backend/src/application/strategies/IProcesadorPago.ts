import { Pago } from '../../domain/entities/Pago';
import { EstadoPago } from '../../domain/enums/EstadoPago';

/**
 * IProcesadorPago - Interfaz para procesar pagos
 * Cumple con ISP (Interface Segregation Principle) y SRP
 */
export interface IProcesadorPago {
  procesar(pago: Pago): Promise<boolean>;
  estaAprobado(pago: Pago): boolean;
}
