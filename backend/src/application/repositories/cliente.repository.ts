/**
 * APPLICATION LAYER - ClienteRepository
 * Repositorio para gestión de Clientes con Supabase
 */

import { supabaseAdmin } from '../../supabase'
import { IClienteRepository } from '../../shared/types'

export class ClienteRepository implements IClienteRepository {
  async save(cliente: any) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .insert(cliente)
      .select()
      .single()
    if (error) throw new Error(`Error: ${error.message}`)
    return data
  }

  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('id_usuario', id)
      .single()
    if (error) return null
    return data
  }

  async findByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()
    if (error) return null
    return data
  }

  async findAll() {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('rol', 'cliente')
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async update(id: string, datos: any) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .update(datos)
      .eq('id_usuario', id)
      .select()
      .single()
    if (error) throw new Error(`Error: ${error.message}`)
    return data
  }

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('usuarios')
      .delete()
      .eq('id_usuario', id)
    if (error) throw new Error(`Error: ${error.message}`)
    return true
  }
}
