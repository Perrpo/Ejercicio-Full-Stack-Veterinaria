/**
 * APPLICATION LAYER - CitaRepository
 * Repositorio para gestión de Citas con Supabase
 */

import { supabaseAdmin } from '../../supabase'
import { ICitaRepository } from '../../shared/types'

const like = (q?: string) => `%${(q || '').trim()}%`

export class CitaRepository implements ICitaRepository {
  async save(cita: any) {
    const { data, error } = await supabaseAdmin
      .from('citas')
      .insert(cita)
      .select()
      .single()
    if (error) throw new Error(`Error guardando cita: ${error.message}`)
    return data
  }

  async findById(id: number) {
    const { data, error } = await supabaseAdmin
      .from('citas')
      .select('*')
      .eq('id_cita', id)
      .single()
    if (error) return null
    return data
  }

  async findByMascota(idMascota: number) {
    const { data, error } = await supabaseAdmin
      .from('citas')
      .select('*')
      .eq('id_paciente', idMascota)
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async findByCliente(idCliente: string) {
    const { data, error } = await supabaseAdmin
      .from('citas')
      .select('*')
      .eq('id_usuario', idCliente)
    if (error) throw new Error(`Error: ${error.message}`)
    return data || []
  }

  async findAll(filtro?: string) {
    let query = supabaseAdmin
      .from('citas')
      .select('*')
      .order('fecha_cita', { ascending: false })

    if (filtro) {
      query = query.or(`estado.ilike.${like(filtro)},motivo.ilike.${like(filtro)}`)
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
      .single()
    if (error) throw new Error(`Error: ${error.message}`)
    return data
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
