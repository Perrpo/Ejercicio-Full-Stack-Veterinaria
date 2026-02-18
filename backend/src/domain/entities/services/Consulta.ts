import { IServicio } from '../interfaces/IServicio';

/**
 * Consulta - Implementación concreta de servicio
 * Cumple con LSP (Liskov Substitution Principle) y OCP (Open/Closed Principle)
 */
export class Consulta implements IServicio {
  nombre = 'Consulta Veterinaria';

  obtenerPrecio(): number {
    return 50000;
  }

  obtenerDuracion(): number {
    return 30; // minutos
  }
}
