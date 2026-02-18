/**
 * DOMAIN LAYER - Entidad Pago
 */

import { EstadoPago, MetodoPago } from '../enums'

export class Pago {
  id: number
  idCita: number
  monto: number
  estado: EstadoPago
  metodo: MetodoPago
  fecha: Date

  constructor(
    id: number,
    idCita: number,
    monto: number,
    metodo: MetodoPago,
    estado: EstadoPago = EstadoPago.Pendiente,
    fecha: Date = new Date()
  ) {
    this.id = id
    this.idCita = idCita
    this.monto = monto
    this.metodo = metodo
    this.estado = estado
    this.fecha = fecha
  }

  async procesar(): Promise<boolean> {
    this.estado = EstadoPago.Pagado
    return true
  }

  estaAprobado(): boolean {
    return this.estado === EstadoPago.Pagado
  }
}
