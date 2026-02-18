/**
 * DOMAIN LAYER - Pago en Efectivo
 */

import { IPago } from './pagos'

export class PagoEfectivo implements IPago {
  monto: number
  aprobado: boolean = false

  constructor(monto: number) {
    this.monto = monto
  }

  async procesar(monto: number): Promise<boolean> {
    if (monto > 0) {
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
