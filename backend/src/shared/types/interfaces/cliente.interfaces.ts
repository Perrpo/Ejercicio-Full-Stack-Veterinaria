/**
 * SHARED LAYER - Interface de Repositorio de Clientes
 */

export interface IClienteRepository {
  save(cliente: any): Promise<any>
  findById(id: string): Promise<any | null>
  findByEmail(email: string): Promise<any | null>
  findAll(): Promise<any[]>
  update(id: string, datos: any): Promise<any>
  delete(id: string): Promise<boolean>
}
