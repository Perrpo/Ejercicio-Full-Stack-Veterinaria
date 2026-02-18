/**
 * DOMAIN LAYER - Pago por Transferencia
 */

import { IPago } from './pagos'

export class PagoTransferencia implements IPago {
  numeroCuenta: string
  bancoOrigen: string
  monto: number
  aprobado: boolean = false

  constructor(numeroCuenta: string, bancoOrigen: string, monto: number) {
    this.numeroCuenta = numeroCuenta
    this.bancoOrigen = bancoOrigen
    this.monto = monto
  }

  async procesar(monto: number): Promise<boolean> {
    if (monto > 0 && this.numeroCuenta.length > 5) {
      this.monto = monto
      this.aprobado = true
      return true
    }
    return false
  }

  estaAprobado(): boolean {
    return this.aprobado
  }
}
