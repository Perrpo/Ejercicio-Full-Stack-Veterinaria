/**
 * SHARED LAYER - DTOs de Veterinarios
 */

export interface CreateVeterinarioDTO {
  nombre: string
  apellido: string
  email: string
  especialidad: string
}

export interface VeterinarioResponseDTO {
  id_usuario: string
  nombre: string
  apellido: string
  email: string
  especialidad: string
}
