/**
 * DOMAIN LAYER - Entidad Cliente
 */

export class Cliente {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  direccion?: string

  constructor(
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    telefono?: string,
    direccion?: string
  ) {
    this.id = id
    this.nombre = nombre
    this.apellido = apellido
    this.email = email
    this.telefono = telefono
    this.direccion = direccion
  }

  validarDatos(): boolean {
    return !!(this.id && this.nombre && this.apellido && this.email)
  }
}
