/**
 * DOMAIN LAYER - Servicio de Urgencias
 */

import { ServicioBase } from './servicios'

export class Urgencias extends ServicioBase {
  constructor(id: number) {
    super(id, 'Urgencias', 'Atención de emergencias 24/7', 400, 60)
  }

  // Urgencias tiene recargo dinámico
  calcularPrecio(): number {
    return super.calcularPrecio() * 1.5
  }
}
