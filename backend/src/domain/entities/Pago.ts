import { EstadoPago } from '../enums/EstadoPago';
import { IMetodoPago } from '../interfaces/IMetodoPago';

/**
 * Pago - Entidad de dominio que representa un pago de una cita
 * Cumple con SRP (Single Responsibility Principle)
 */
export class Pago {
  constructor(
    public id: string,
    public monto: number,
    public estado: EstadoPago,
    public metodo: IMetodoPago,
  ) {}

  obtenerEstado(): EstadoPago {
    return this.estado;
  }

  cambiarEstado(nuevoEstado: EstadoPago): void {
    this.estado = nuevoEstado;
  }

  obtenerMonto(): number {
    return this.monto;
  }

  esPendiente(): boolean {
    return this.estado === EstadoPago.PENDIENTE;
  }

  estaPagado(): boolean {
    return this.estado === EstadoPago.PAGADO;
  }

  esRechazado(): boolean {
    return this.estado === EstadoPago.RECHAZADO;
  }
}
