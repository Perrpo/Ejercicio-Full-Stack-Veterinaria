/**
 * APPLICATION LAYER - IMascotaRepository Interface
 * Define el contrato para persistencia de Mascotas
 */

import { Mascota } from '../../domain/entities/mascota.entity'

export interface IMascotaRepository {
  save(m: Mascota): Promise<Mascota>
  findById(id: number): Promise<Mascota | null>
  findByCliente(idCliente: string): Promise<Mascota[]>
  update(id: number, data: Partial<Mascota>): Promise<Mascota>
  delete(id: number): Promise<boolean>
}
