/**
 * DOMAIN LAYER - Servicio de Urgencias
 */

import { IServicio } from './servicios'

export class Urgencias implements IServicio {
  id: number
  nombre = 'Urgencias'
  descripcion = 'Atención de emergencias 24/7'
  precioBase = 400
  duracionMinutos = 60

  constructor(id: number) {
    this.id = id
  }

  calcularPrecio(): number {
    // Porcentaje adicional por urgencia
    return this.precioBase * 1.5
  }

  duracion(): number {
    return this.duracionMinutos
  }
}
