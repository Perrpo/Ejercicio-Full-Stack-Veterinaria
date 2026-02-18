import { IMetodoPago } from '../interfaces/IMetodoPago';
import { EstadoPago } from '../enums/EstadoPago';

export class Pago {
  constructor(
    public id: string,
    public monto: number,
    public metodoPago: IMetodoPago,
    public estado: EstadoPago,
    public fechaPago: Date,
  ) {}

  obtenerMonto(): number {
    return this.monto;
  }

  obtenerTipo(): string {
    return this.metodoPago.obtenerTipo();
  }
}