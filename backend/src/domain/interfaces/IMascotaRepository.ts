import { Mascota } from '../entities/Mascota';

/**
 * IMascotaRepository - Interfaz para operaciones de persistencia de mascotas
 * Cumple con ISP (Interface Segregation Principle) y DIP (Dependency Inversion Principle)
 */
export interface IMascotaRepository {
  save(mascota: Mascota): Promise<void>;
  findById(id: string): Promise<Mascota | null>;
  findByCliente(clienteId: string): Promise<Mascota[]>;
  delete(id: string): Promise<void>;
}
