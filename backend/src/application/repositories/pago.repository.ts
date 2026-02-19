/**
 * APPLICATION LAYER - PagoRepository
 * Repositorio para gestión de Pagos con Supabase
 */

import { supabaseAdmin } from '../../supabase'
import { IPagoRepository } from '../interfaces'

export class PagoRepository implements IPagoRepository {
  async save(pago: any) {
    const { data, error } = await supabaseAdmin
      .from('pagos')
      .insert(pago)
      .select()
      .single()
    if (error) throw new Error(`Error: ${error.message}`)
    return data
  }

  async findById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('pagos')
      .select('*')
      .eq('id_pago', id)
      .single()
    if (error) return null
    return data
  }

  async findByCita(idCita: number) {
    const { data, error } = await supabaseAdmin
      .from('pagos')
      .select('*')
      .eq('id_cita', idCita)
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async findAll() {
    const { data, error } = await supabaseAdmin.from('pagos').select('*')
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async update(id: number, datos: any) {
    const { data, error } = await supabaseAdmin
      .from('pagos')
      .update(datos)
      .eq('id_pago', id)
      .select()
      .single()
    if (error) throw new Error(`Error: ${error.message}`)
    return data
  }

  async delete(id: number) {
    const { error } = await supabaseAdmin
      .from('pagos')
      .delete()
      .eq('id_pago', id)
    if (error) throw new Error(`Error: ${error.message}`)
    return true
  }
}
