/**
 * IMetodoPago - Interfaz para métodos de pago
 * Cumple con ISP (Interface Segregation Principle)
 */
export interface IMetodoPago {
  procesar(monto: number): Promise<boolean>;
  obtenerTipo(): string;
}
