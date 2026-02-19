/**
 * DOMAIN LAYER - Entidad Cita
 */

import { EstadoCita, EstadoPago } from '../enums'
import { IServicio } from '../services-domain/servicios'
import { Pago } from './pago.entity'

export class Cita {
  id: number
  idMascota: number
  idVeterinario: string
  idCliente: string
  fecha: Date
  estado: EstadoCita
  servicios: IServicio[]
  pagos: Pago[]
  motivo?: string

  constructor(
    id: number,
    idMascota: number,
    idVeterinario: string,
    idCliente: string,
    fecha: Date,
    estado: EstadoCita = EstadoCita.Pendiente,
    motivo?: string,
    servicios: IServicio[] = [],
    pagos: Pago[] = []
  ) {
    this.id = id
    this.idMascota = idMascota
    this.idVeterinario = idVeterinario
    this.idCliente = idCliente
    this.fecha = fecha
    this.estado = estado
    this.motivo = motivo
    this.servicios = servicios
    this.pagos = pagos
  }

  asignarVeterinarioAutomatico(idVeterinario: string): void {
    this.idVeterinario = idVeterinario
  }

  agregarServicio(servicio: IServicio): void {
    this.servicios.push(servicio)
  }

  calcularTotal(): number {
    return this.servicios.reduce((total, servicio) => {
      return total + servicio.calcularPrecio()
    }, 0)
  }

  confirmar(): void {
    if (this.estado === EstadoCita.Pendiente) {
      this.estado = EstadoCita.Confirmada
    }
  }

  cancelar(): void {
    this.estado = EstadoCita.Cancelada
  }

  finalizar(): void {
    this.estado = EstadoCita.Finalizada
  }

  registrarPago(pago: Pago): void {
    this.pagos.push(pago)
  }

  estaPagada(): boolean {
    const totalPagado = this.pagos
      .filter(p => p.estado === EstadoPago.Pagado)
      .reduce((sum, p) => sum + p.monto, 0)
    return totalPagado >= this.calcularTotal()
  }
}
