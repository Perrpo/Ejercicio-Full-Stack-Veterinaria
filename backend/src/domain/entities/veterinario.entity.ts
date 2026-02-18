/**
 * DOMAIN LAYER - Entidad Veterinario
 */

export class Veterinario {
  id: string
  nombre: string
  apellido: string
  email: string
  especialidad: string

  constructor(
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    especialidad: string
  ) {
    this.id = id
    this.nombre = nombre
    this.apellido = apellido
    this.email = email
    this.especialidad = especialidad
  }

  estaDisponible(fecha: Date): boolean {
    return fecha > new Date()
  }
}
