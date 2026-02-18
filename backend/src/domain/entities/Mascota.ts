import { Cliente } from './Cliente';

/**
 * Mascota - Entidad de dominio que representa una mascota/paciente
 * Cumple con SRP (Single Responsibility Principle)
 */
export class Mascota {
  constructor(
    public id: string,
    public nombre: string,
    public especie: string,
    public raza: string,
    public edad: number,
    public cliente: Cliente,
  ) {}

  validarDatos(): boolean {
    return (
      this.nombre.trim().length > 0 &&
      this.especie.trim().length > 0 &&
      this.raza.trim().length > 0 &&
      this.edad >= 0
    );
  }
}
