/**
 * DOMAIN LAYER - Servicio de Peluquería
 */

import { IServicio } from './servicios'

export class Peluqueria implements IServicio {
  id: number
  nombre = 'Peluquería'
  descripcion = 'Servicio de baño y grooming'
  precioBase = 300
  duracionMinutos = 60

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
