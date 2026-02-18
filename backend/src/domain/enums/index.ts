/**
 * DOMAIN LAYER - Enumeraciones
 */

export enum EstadoCita {
  Pendiente = 'pendiente',
  Confirmada = 'confirmada',
  Finalizada = 'finalizada',
  Cancelada = 'cancelada'
}

export enum EstadoPago {
  Pendiente = 'pendiente',
  Pagado = 'pagado',
  Rechazado = 'rechazado'
}

export enum MetodoPago {
  Efectivo = 'efectivo',
  TarjetaCredito = 'tarjeta_credito',
  TarjetaDebito = 'tarjeta_debito',
  Transferencia = 'transferencia'
}
