/**
 * APPLICATION LAYER - VeterinarioRepository
 * Repositorio para gestión de Veterinarios con Supabase
 */

import { supabaseAdmin } from '../../supabase'
import { IVeterinarioRepository } from '../../shared/types'

export class VeterinarioRepository implements IVeterinarioRepository {
  async save(veterinario: any) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .insert(veterinario)
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

  async findByEspecialidad(especialidad: string) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('rol', 'veterinario')
      .eq('especialidad', especialidad)
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async findAll() {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('rol', 'veterinario')
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
