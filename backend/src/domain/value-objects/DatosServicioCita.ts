import { IServicio } from '../interfaces/IServicio';

/**
 * DatosServicioCita - Value Object para gestionar servicios de una cita
 * Cumple con SRP (Single Responsibility Principle)
 */
export class DatosServicioCita {
  private servicios: IServicio[] = [];

  agregarServicio(servicio: IServicio): void {
    if (!this.servicios.find((s) => s.nombre === servicio.nombre)) {
      this.servicios.push(servicio);
    }
  }

  removerServicio(nombre: string): void {
    this.servicios = this.servicios.filter((s) => s.nombre !== nombre);
  }

  obtenerServicios(): IServicio[] {
    return [...this.servicios];
  }

  estaVacia(): boolean {
    return this.servicios.length === 0;
  }

  limpiar(): void {
    this.servicios = [];
  }
}
