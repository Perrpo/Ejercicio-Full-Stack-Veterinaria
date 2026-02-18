import { Mascota } from './Mascota';
import { Veterinario } from './Veterinario';
import { DatosServicioCita } from '../value-objects/DatosServicioCita';
import { EstadoActualCita } from '../value-objects/EstadoActualCita';
import { Pago } from '../value-objects/Pago';
import { EstadoCita } from '../enums/EstadoCita';

/**
 * Cita - Entidad de dominio principal que representa una cita veterinaria
 * Cumple con SRP (Single Responsibility Principle) - solo gestiona datos de la cita
 * Las responsabilidades de cálculo de precios, cambios de estado y pagos están delegadas
 */
export class Cita {
  private datosServicios: DatosServicioCita = new DatosServicioCita();
  private estadoActual: EstadoActualCita = new EstadoActualCita();
  private pagos: Pago[] = [];

  constructor(
    public id: string,
    public fecha: Date,
    public mascota: Mascota,
    public veterinario: Veterinario,
    public observaciones?: string,
  ) {}

  agregarServicio(servicio: any): void {
    this.datosServicios.agregarServicio(servicio);
  }

  removerServicio(nombre: string): void {
    this.datosServicios.removerServicio(nombre);
  }

  obtenerServicios(): any[] {
    return this.datosServicios.obtenerServicios();
  }

  obtenerEstado(): EstadoCita {
    return this.estadoActual.obtenerEstado();
  }

  cambiarEstado(nuevoEstado: EstadoCita): void {
    this.estadoActual.cambiarEstado(nuevoEstado);
  }

  agregarPago(pago: Pago): void {
    this.pagos.push(pago);
  }

  obtenerPagos(): Pago[] {
    return [...this.pagos];
  }

  obtenerMascota(): Mascota {
    return this.mascota;
  }

  obtenerVeterinario(): Veterinario {
    return this.veterinario;
  }

  obtenerFecha(): Date {
    return this.fecha;
  }

  estaVacia(): boolean {
    return this.datosServicios.estaVacia();
  }
}
