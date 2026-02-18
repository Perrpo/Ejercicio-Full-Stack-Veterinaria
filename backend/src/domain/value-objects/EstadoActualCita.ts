import { EstadoCita } from '../enums/EstadoCita';

/**
 * EstadoActualCita - Value Object para gestionar el estado de una cita
 * Cumple con SRP (Single Responsibility Principle)
 */
export class EstadoActualCita {
  private estado: EstadoCita;

  constructor(estadoInicial: EstadoCita = EstadoCita.PENDIENTE) {
    this.estado = estadoInicial;
  }

  obtenerEstado(): EstadoCita {
    return this.estado;
  }

  cambiarEstado(nuevoEstado: EstadoCita): void {
    this.estado = nuevoEstado;
  }

  esPendiente(): boolean {
    return this.estado === EstadoCita.PENDIENTE;
  }

  esConfirmada(): boolean {
    return this.estado === EstadoCita.CONFIRMADA;
  }

  esCancelada(): boolean {
    return this.estado === EstadoCita.CANCELADA;
  }

  esFinalizada(): boolean {
    return this.estado === EstadoCita.FINALIZADA;
  }
}
