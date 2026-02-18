/**
 * SHARED LAYER - Interface de Repositorio de Citas
 */

import { CitaResponseDTO } from '../dtos/index'

export interface ICitaRepository {
  save(cita: any): Promise<CitaResponseDTO>
  findById(id: number): Promise<CitaResponseDTO | null>
  findByMascota(idMascota: number): Promise<CitaResponseDTO[]>
  findByCliente(idCliente: string): Promise<CitaResponseDTO[]>
  findAll(filtro?: string): Promise<CitaResponseDTO[]>
  update(id: number, datos: any): Promise<CitaResponseDTO>
  delete(id: number): Promise<boolean>
}
