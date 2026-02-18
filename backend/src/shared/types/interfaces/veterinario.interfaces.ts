/**
 * SHARED LAYER - Interface de Repositorio de Veterinarios
 */

export interface IVeterinarioRepository {
  save(veterinario: any): Promise<any>
  findById(id: string): Promise<any | null>
  findByEspecialidad(especialidad: string): Promise<any[]>
  findAll(): Promise<any[]>
  update(id: string, datos: any): Promise<any>
  delete(id: string): Promise<boolean>
}
