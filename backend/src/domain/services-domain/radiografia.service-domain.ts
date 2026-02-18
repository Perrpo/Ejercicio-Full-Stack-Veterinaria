/**
 * DOMAIN LAYER - Servicio de Radiografía
 */

import { IServicio } from './servicios'

export class Radiografia implements IServicio {
  id: number
  nombre = 'Radiografía'
  descripcion = 'Servicio de radiografía para diagnóstico'
  precioBase = 250
  duracionMinutos = 30

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
