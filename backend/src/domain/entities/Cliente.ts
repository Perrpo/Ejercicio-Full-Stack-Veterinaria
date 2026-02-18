/**
 * Cliente - Entidad de dominio que representa un cliente de la clínica
 * Cumple con SRP (Single Responsibility Principle)
 */
export class Cliente {
  constructor(
    public id: string,
    public nombre: string,
    public email: string,
    public telefono?: string,
    public direccion?: string,
  ) {}

  validarDatos(): boolean {
    return (
      this.nombre.trim().length > 0 &&
      this.email.includes('@') &&
      this.id.trim().length > 0
    );
  }
}
