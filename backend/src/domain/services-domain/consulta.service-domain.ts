/**
 * DOMAIN LAYER - Servicio de Consulta
 */

import { IServicio } from './servicios'

export class Consulta implements IServicio {
  id: number
  nombre = 'Consulta'
  descripcion = 'Consulta general con el veterinario'
  precioBase = 100
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
