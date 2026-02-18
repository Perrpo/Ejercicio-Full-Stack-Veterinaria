/**
 * SHARED LAYER - Interface de Repositorio de Pagos
 */

export interface IPagoRepository {
  save(pago: any): Promise<any>
  findById(id: number): Promise<any | null>
  findByCita(idCita: number): Promise<any[]>
  findAll(): Promise<any[]>
  update(id: number, datos: any): Promise<any>
  delete(id: number): Promise<boolean>
}
