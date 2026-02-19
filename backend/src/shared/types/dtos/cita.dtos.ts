/**
 * SHARED LAYER - DTOs de Citas
 */

import { EstadoCita } from '../../../domain/enums'

export interface CreateCitaDTO {
  id_usuario: string
  id_paciente: number
  id_servicio: number
  fecha_cita: Date | string
}

export interface UpdateCitaDTO {
  estado?: EstadoCita
  fecha_cita?: Date | string
}

export interface CitaResponseDTO {
  id_cita: number
  id_usuario: string
  id_paciente: number
  id_servicio: number
  fecha_cita: Date
  estado: EstadoCita
}
