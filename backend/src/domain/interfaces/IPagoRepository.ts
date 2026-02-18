import { Pago } from '../entities/Pago';

/**
 * IPagoRepository - Interfaz para operaciones de persistencia de pagos
 * Cumple con ISP (Interface Segregation Principle) y DIP (Dependency Inversion Principle)
 */
export interface IPagoRepository {
  save(pago: Pago): Promise<void>;
  findById(id: string): Promise<Pago | null>;
  findByCita(citaId: string): Promise<Pago[]>;
  delete(id: string): Promise<void>;
}
