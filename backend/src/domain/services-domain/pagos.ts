/**
 * DOMAIN LAYER - Servicios de Dominio Pagos
 * Interface base para pagos
 */

export interface IPago {
  procesar(monto: number): Promise<boolean>
  estaAprobado(): boolean
}

// Re-exportar todas las implementaciones
export { PagoTarjeta } from './pago-tarjeta.service-domain'
export { PagoEfectivo } from './pago-efectivo.service-domain'
export { PagoTransferencia } from './pago-transferencia.service-domain'
