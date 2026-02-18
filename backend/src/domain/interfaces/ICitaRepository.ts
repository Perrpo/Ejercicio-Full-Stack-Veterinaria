import { Cita } from '../entities/Cita';

/**
 * ICitaRepository - Interfaz para operaciones de persistencia de citas
 * Cumple con ISP (Interface Segregation Principle) y DIP (Dependency Inversion Principle)
 */
export interface ICitaRepository {
  save(cita: Cita): Promise<void>;
  findById(id: string): Promise<Cita | null>;
  findByMascota(mascotaId: string): Promise<Cita[]>;
  findByCliente(clienteId: string): Promise<Cita[]>;
  delete(id: string): Promise<void>;
}
