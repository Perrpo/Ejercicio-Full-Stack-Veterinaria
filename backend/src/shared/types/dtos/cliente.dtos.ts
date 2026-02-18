/**
 * SHARED LAYER - DTOs de Clientes
 */

export interface CreateClienteDTO {
  nombre: string
  apellido: string
  email: string
  telefono?: string
  direccion?: string
}

export interface ClienteResponseDTO {
  id_usuario: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  direccion?: string
}
