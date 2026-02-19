/**
 * APPLICATION LAYER - IPagoRepository Interface
 * Define el contrato para persistencia de Pagos
 */

import { Pago } from '../../domain/entities/pago.entity'

export interface IPagoRepository {
  save(p: any): Promise<any>
  findById(id: number): Promise<any>
  findByCita(idCita: number): Promise<any[]>
  findAll(): Promise<any[]>
  update(id: number, data: Partial<any>): Promise<any>
  delete(id: number): Promise<boolean>
}
