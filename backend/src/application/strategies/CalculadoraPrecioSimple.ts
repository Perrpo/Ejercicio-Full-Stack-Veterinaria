import { ICalculadoraPrecio } from './ICalculadoraPrecio';
import { IServicio } from '../../domain/interfaces/IServicio';

/**
 * CalculadoraPrecioSimple - Estrategia simple de cálculo de precios
 * Cumple con OCP (Open/Closed Principle) - se puede extender sin modificar
 */
export class CalculadoraPrecioSimple implements ICalculadoraPrecio {
  calcular(servicios: IServicio[]): number {
    if (!servicios || servicios.length === 0) {
      return 0;
    }
    return servicios.reduce((total, servicio) => total + servicio.obtenerPrecio(), 0);
  }

  obtenerDescripcion(): string {
    return 'Cálculo de precio simple (suma de servicios)';
  }
}
