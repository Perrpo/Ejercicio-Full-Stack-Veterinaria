/**
 * DOMAIN LAYER - Pago con Tarjeta
 */

import { IPago } from './pagos'

export class PagoTarjeta implements IPago {
  numeroTarjeta: string
  titular: string
  monto: number
  aprobado: boolean = false

  constructor(numeroTarjeta: string, titular: string, monto: number) {
    this.numeroTarjeta = numeroTarjeta
    this.titular = titular
    this.monto = monto
  }

  async procesar(monto: number): Promise<boolean> {
    // Simular procesamiento
    if (monto > 0 && this.numeroTarjeta.length === 16) {
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
