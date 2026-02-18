import { EstadoCita } from '../../domain/enums/EstadoCita';

/**
 * IGestorEstadoCita - Interfaz para gestores de transición de estados
 * Cumple con ISP (Interface Segregation Principle) y Strategy Pattern
 */
export interface IGestorEstadoCita {
  transicionar(estadoActual: EstadoCita): EstadoCita;
  esTransicionValida(estadoActual: EstadoCita): boolean;
}
