/**
 * DOMAIN LAYER - Servicio de Cirugía Menor
 */

import { IServicio } from './servicios'

export class CirugiaMenor implements IServicio {
  id: number
  nombre = 'Cirugía Menor'
  descripcion = 'Cirugías menores y procedimientos quirúrgicos simples'
  precioBase = 500
  duracionMinutos = 90

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
