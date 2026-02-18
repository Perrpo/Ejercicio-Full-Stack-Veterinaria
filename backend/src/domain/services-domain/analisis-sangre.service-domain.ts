/**
 * DOMAIN LAYER - Servicio de Análisis de Sangre
 */

import { IServicio } from './servicios'

export class AnalisisSangre implements IServicio {
  id: number
  nombre = 'Análisis de Sangre'
  descripcion = 'Análisis de laboratorio de sangre'
  precioBase = 200
  duracionMinutos = 15

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
