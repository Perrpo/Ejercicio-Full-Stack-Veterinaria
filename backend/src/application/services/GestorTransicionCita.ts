import { ICitaRepository } from '../../domain/interfaces/ICitaRepository';
import { IGestorEstadoCita } from '../strategies/IGestorEstadoCita';
import {
  GestorConfirmacion,
  GestorCancelacion,
  GestorFinalizacion,
} from '../strategies/GestoresEstadoCita';

/**
 * GestorTransicionCita - Servicio de aplicación para transiciones de estado
 * Cumple con SRP (Single Responsibility Principle) - solo gestiona transiciones
 * Cumple con OCP (Open/Closed Principle) - fácil de extender con nuevos gestores
 */
export class GestorTransicionCita {
  private gestores: Map<string, IGestorEstadoCita>;

  constructor(private citaRepository: ICitaRepository) {
    this.gestores = new Map();
    this.gestores.set('confirmar', new GestorConfirmacion());
    this.gestores.set('cancelar', new GestorCancelacion());
    this.gestores.set('finalizar', new GestorFinalizacion());
  }

  async confirmarCita(citaId: string): Promise<void> {
    await this.transicionarCita(citaId, 'confirmar');
  }

  async cancelarCita(citaId: string): Promise<void> {
    await this.transicionarCita(citaId, 'cancelar');
  }

  async finalizarCita(citaId: string): Promise<void> {
    await this.transicionarCita(citaId, 'finalizar');
  }

  private async transicionarCita(citaId: string, accion: string): Promise<void> {
    const cita = await this.citaRepository.findById(citaId);
    if (!cita) {
      throw new Error('Cita no encontrada');
    }

    const gestor = this.gestores.get(accion);
    if (!gestor) {
      throw new Error(`Acción no es válida: ${accion}`);
    }

    const estadoActual = cita.obtenerEstado();
    if (!gestor.esTransicionValida(estadoActual)) {
      throw new Error(
        `No se puede ${accion} una cita en estado ${estadoActual}`,
      );
    }

    const nuevoEstado = gestor.transicionar(estadoActual);
    cita.cambiarEstado(nuevoEstado);
    await this.citaRepository.save(cita);
  }
}
