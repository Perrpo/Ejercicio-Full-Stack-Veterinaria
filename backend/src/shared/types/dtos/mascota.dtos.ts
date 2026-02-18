/**
 * SHARED LAYER - DTOs de Mascotas
 */

export interface CreateMascotaDTO {
  id_usuario: string
  nombre: string
  especie: string
  raza?: string
  edad?: number
  peso?: number
}

export interface MascotaResponseDTO {
  id_paciente: number
  id_usuario: string
  nombre: string
  especie: string
  raza?: string
  edad?: number
  peso?: number
}
