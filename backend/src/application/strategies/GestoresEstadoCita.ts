import { IGestorEstadoCita } from './IGestorEstadoCita';
import { EstadoCita } from '../../domain/enums/EstadoCita';

/**
 * GestorConfirmacion - Gestor para confirmar una cita
 * Cumple con OCP (Open/Closed Principle) - cada gestor es responsable de una transición
 */
export class GestorConfirmacion implements IGestorEstadoCita {
  transicionar(estadoActual: EstadoCita): EstadoCita {
    if (this.esTransicionValida(estadoActual)) {
      return EstadoCita.CONFIRMADA;
    }
    return estadoActual;
  }

  esTransicionValida(estadoActual: EstadoCita): boolean {
    return estadoActual === EstadoCita.PENDIENTE;
  }
}

/**
 * GestorCancelacion - Gestor para cancelar una cita
 */
export class GestorCancelacion implements IGestorEstadoCita {
  transicionar(estadoActual: EstadoCita): EstadoCita {
    if (this.esTransicionValida(estadoActual)) {
      return EstadoCita.CANCELADA;
    }
    return estadoActual;
  }

  esTransicionValida(estadoActual: EstadoCita): boolean {
    // Se puede cancelar desde Pendiente o Confirmada
    return estadoActual === EstadoCita.PENDIENTE || estadoActual === EstadoCita.CONFIRMADA;
  }
}

/**
 * GestorFinalizacion - Gestor para finalizar una cita
 */
export class GestorFinalizacion implements IGestorEstadoCita {
  transicionar(estadoActual: EstadoCita): EstadoCita {
    if (this.esTransicionValida(estadoActual)) {
      return EstadoCita.FINALIZADA;
    }
    return estadoActual;
  }

  esTransicionValida(estadoActual: EstadoCita): boolean {
    return estadoActual === EstadoCita.CONFIRMADA;
  }
}
