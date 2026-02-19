/**
 * APPLICATION LAYER - CitaRepository
 * Repositorio para gestión de Citas con Supabase
 */

import { supabaseAdmin } from '../../supabase'
import { ICitaRepository } from '../interfaces'

const like = (q?: string) => `%${(q || '').trim()}%`

export class CitaRepository implements ICitaRepository {
  async save(cita: any) {
    const { data, error } = await supabaseAdmin
      .from('citas')
      .insert(cita)
      .select()
    if (error) throw new Error(`Error guardando cita: ${error.message}`)
    return data && data.length > 0 ? data[0] : null
  }

  async findById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('citas')
      .select('*')
      .eq('id_cita', id)
    
    if (error) {
      console.error('Error en findById:', error)
      return null
    }
    
    if (!data || data.length === 0) {
      return null
    }
    
    return data[0]
  }

  async findByMascota(idMascota: number) {
    const { data, error } = await supabaseAdmin
      .from('citas')
      .select('*')
      .eq('id_paciente', idMascota)
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async findAll(filtro?: string) {
    let query = supabaseAdmin
      .from('citas')
      .select('*')
      .order('fecha_cita', { ascending: false })

    if (filtro) {
      query = query.or(`estado.ilike.${like(filtro)}`)
    }

    const { data, error } = await query
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async update(id: number, datos: any) {
    const { data, error } = await supabaseAdmin
      .from('citas')
      .update(datos)
      .eq('id_cita', id)
      .select()
    if (error) throw new Error(`Error: ${error.message}`)
    if (!data || data.length === 0) throw new Error('Cita no encontrada')
    return data[0]
  }

  async delete(id: number) {
    const { error } = await supabaseAdmin
      .from('citas')
      .delete()
      .eq('id_cita', id)
    if (error) throw new Error(`Error: ${error.message}`)
    return true
  }
}
