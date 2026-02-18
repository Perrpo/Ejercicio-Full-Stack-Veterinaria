/**
 * Veterinario - Entidad de dominio que representa un veterinario
 * Cumple con SRP (Single Responsibility Principle)
 */
export class Veterinario {
  constructor(
    public id: string,
    public nombre: string,
    public especialidad: string,
    public disponible: boolean = true,
  ) {}

  estaDisponible(): boolean {
    return this.disponible;
  }

  marcarDisponible(): void {
    this.disponible = true;
  }

  marcarNoDisponible(): void {
    this.disponible = false;
  }
}
