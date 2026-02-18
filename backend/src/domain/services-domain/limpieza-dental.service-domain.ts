/**
 * DOMAIN LAYER - Servicio de Limpieza Dental
 */

import { IServicio } from './servicios'

export class LimpiezaDental implements IServicio {
  id: number
  nombre = 'Limpieza Dental'
  descripcion = 'Limpieza y profilaxis dental'
  precioBase = 350
  duracionMinutos = 45

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
