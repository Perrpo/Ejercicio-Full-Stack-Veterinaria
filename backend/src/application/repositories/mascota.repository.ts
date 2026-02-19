/**
 * APPLICATION LAYER - MascotaRepository
 * Repositorio para gestión de Mascotas con Supabase
 */

import { supabaseAdmin } from '../../supabase'
import { IMascotaRepository } from '../interfaces'

export class MascotaRepository implements IMascotaRepository {
  async save(mascota: any) {
    const { data, error } = await supabaseAdmin
      .from('pacientes')
      .insert(mascota)
      .select()
      .single()
    if (error) throw new Error(`Error: ${error.message}`)
    return data
  }

  async findById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('pacientes')
      .select('*')
      .eq('id_paciente', id)
      .single()
    if (error) return null
    return data
  }

  async findByCliente(idCliente: string) {
    const { data, error } = await supabaseAdmin
      .from('pacientes')
      .select('*')
      .eq('id_usuario', idCliente)
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async findAll() {
    const { data, error } = await supabaseAdmin.from('pacientes').select('*')
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async update(id: number, datos: any) {
    const { data, error } = await supabaseAdmin
      .from('pacientes')
      .update(datos)
      .eq('id_paciente', id)
      .select()
      .single()
    if (error) throw new Error(`Error: ${error.message}`)
    return data
  }

  async delete(id: number) {
    const { error } = await supabaseAdmin
      .from('pacientes')
      .delete()
      .eq('id_paciente', id)
    if (error) throw new Error(`Error: ${error.message}`)
    return true
  }
}
