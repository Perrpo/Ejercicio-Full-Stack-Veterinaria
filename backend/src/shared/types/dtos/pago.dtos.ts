/**
 * SHARED LAYER - DTOs de Pagos
 */

import { EstadoPago, MetodoPago } from '../../../domain/enums'

export interface CreatePagoDTO {
  id_cita: number
  metodo_pago: MetodoPago
  monto: number
}

export interface UpdatePagoDTO {
  estado?: EstadoPago
  monto?: number
  metodo_pago?: MetodoPago
}

export interface PagoResponseDTO {
  id_pago: number
  id_cita: number
  metodo_pago: MetodoPago
  monto: number
  estado: EstadoPago
  fecha_pago: Date
}
