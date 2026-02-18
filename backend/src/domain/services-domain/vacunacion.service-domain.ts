/**
 * DOMAIN LAYER - Servicio de Vacunación
 */

import { IServicio } from './servicios'

export class Vacunacion implements IServicio {
  id: number
  nombre = 'Vacunación'
  descripcion = 'Aplicación de vacunas preventivas'
  precioBase = 150
  duracionMinutos = 20

  constructor(id: number) {
    this.id = id
  }

  calcularPrecio(): number {
    return this.precioBase
  }

  duracion(): number {
    return this.duracionMinutos
  }
}
