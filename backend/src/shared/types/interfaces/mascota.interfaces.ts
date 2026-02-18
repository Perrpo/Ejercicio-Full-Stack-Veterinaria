/**
 * SHARED LAYER - Interface de Repositorio de Mascotas
 */

export interface IMascotaRepository {
  save(mascota: any): Promise<any>
  findById(id: number): Promise<any | null>
  findByCliente(idCliente: string): Promise<any[]>
  findAll(): Promise<any[]>
  update(id: number, datos: any): Promise<any>
  delete(id: number): Promise<boolean>
}
