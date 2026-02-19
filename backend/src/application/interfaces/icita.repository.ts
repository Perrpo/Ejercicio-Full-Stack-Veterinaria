/**
 * APPLICATION LAYER - ICitaRepository Interface
 * Define el contrato para persistencia de Citas
 */

import { Cita } from '../../domain/entities/cita.entity'

export interface ICitaRepository {
  save(c: any): Promise<any>
  findById(id: number): Promise<any>
  findByMascota(idMascota: number): Promise<any[]>
  findAll(filtro?: string): Promise<any[]>
  update(id: number, data: Partial<any>): Promise<any>
  delete(id: number): Promise<boolean>
}
