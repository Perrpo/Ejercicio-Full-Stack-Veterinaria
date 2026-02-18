import { IMetodoPago } from '../../domain/interfaces/IMetodoPago';

/**
 * PagoTarjeta - Implementación concreta de método de pago
 * Cumple con LSP (Liskov Substitution Principle) e implementa IMetodoPago
 */
export class PagoTarjeta implements IMetodoPago {
  async procesar(monto: number): Promise<boolean> {
    // Aquí iría la integración con un procesador de pagos de tarjeta
    console.log(`Procesando pago con tarjeta: $${monto}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.1), 1000); // 90% de éxito
    });
  }

  obtenerTipo(): string {
    return 'Tarjeta de Crédito/Débito';
  }
}

/**
 * PagoEfectivo - Implementación concreta de método de pago
 */
export class PagoEfectivo implements IMetodoPago {
  async procesar(monto: number): Promise<boolean> {
    console.log(`Procesando pago en efectivo: $${monto}`);
    // El efectivo siempre se procesa
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  }

  obtenerTipo(): string {
    return 'Efectivo';
  }
}

/**
 * PagoTransferencia - Implementación concreta de método de pago
 */
export class PagoTransferencia implements IMetodoPago {
  async procesar(monto: number): Promise<boolean> {
    console.log(`Procesando transferencia bancaria: $${monto}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(Math.random() > 0.05), 1500); // 95% de éxito
    });
  }

  obtenerTipo(): string {
    return 'Transferencia Bancaria';
  }
}
