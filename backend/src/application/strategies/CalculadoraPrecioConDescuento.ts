import { ICalculadoraPrecio } from './ICalculadoraPrecio';
import { IServicio } from '../../domain/interfaces/IServicio';

/**
 * CalculadoraPrecioConDescuento - Estrategia con descuento por volumen
 * Cumple con OCP (Open/Closed Principle) - se puede extender sin modificar
 */
export class CalculadoraPrecioConDescuento implements ICalculadoraPrecio {
  constructor(private porcentajeDescuento: number = 10) {}

  calcular(servicios: IServicio[]): number {
    if (!servicios || servicios.length === 0) {
      return 0;
    }

    const subtotal = servicios.reduce((total, servicio) => total + servicio.obtenerPrecio(), 0);

    // Aplicar descuento si hay más de 2 servicios
    if (servicios.length > 2) {
      const descuento = (subtotal * this.porcentajeDescuento) / 100;
      return subtotal - descuento;
    }

    return subtotal;
  }

  obtenerDescripcion(): string {
    return `Cálculo con descuento del ${this.porcentajeDescuento}% por más de 2 servicios`;
  }
}
