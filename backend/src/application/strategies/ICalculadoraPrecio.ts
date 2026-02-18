import { IServicio } from '../../domain/interfaces/IServicio';

/**
 * ICalculadoraPrecio - Interfaz para estrategias de cálculo de precio
 * Cumple con ISP (Interface Segregation Principle) y OCP (Open/Closed Principle)
 */
export interface ICalculadoraPrecio {
  calcular(servicios: IServicio[]): number;
  obtenerDescripcion(): string;
}
