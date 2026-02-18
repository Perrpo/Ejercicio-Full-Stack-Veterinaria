/**
 * DOMAIN LAYER - Entidad Mascota
 */

export class Mascota {
  id: number
  idCliente: string
  nombre: string
  especie: string
  raza?: string
  edad?: number
  peso?: number

  constructor(
    id: number,
    idCliente: string,
    nombre: string,
    especie: string,
    raza?: string,
    edad?: number,
    peso?: number
  ) {
    this.id = id
    this.idCliente = idCliente
    this.nombre = nombre
    this.especie = especie
    this.raza = raza
    this.edad = edad
    this.peso = peso
  }
}
