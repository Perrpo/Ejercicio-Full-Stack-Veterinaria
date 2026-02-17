import { supabaseAdmin } from '../../supabase'
import {
  AdminCitaDTO,
  AdminCitaUpdateDTO
} from '../../schemas/admin/citas.schema'

const like = (q?: string) => `%${(q || '').trim()}%`

export class CitasAdminService {

  static async getCitas(q?: string) {
    const query = supabaseAdmin
      .from('citas')
      .select(`
        id,
        fecha,
        estado,
        motivo,
        pacientes (
          nombre,
          especie
        ),
        usuarios (
          nombre,
          apellido
        ),
        servicios (
          nombre
        )
      `)
      .order('fecha', { ascending: false })

    const { data, error } = q
      ? await query.or(
          `estado.ilike.${like(q)},motivo.ilike.${like(q)}`
        )
      : await query

    if (error) throw new Error('Error obteniendo citas')
    return data ?? []
  }

  static async createCita(data: AdminCitaDTO) {
    const { error } =
      await supabaseAdmin
        .from('citas')
        .insert(data)

    if (error) throw new Error('Error creando cita')
  }

  static async updateCita(
    id: string,
    data: AdminCitaUpdateDTO
  ) {
    const { error } =
      await supabaseAdmin
        .from('citas')
        .update(data)
        .eq('id', id)

    if (error) throw new Error('Error actualizando cita')
  }

  static async deleteCita(id: string) {
    const { error } =
      await supabaseAdmin
        .from('citas')
        .delete()
        .eq('id', id)

    if (error) throw new Error('Error eliminando cita')
  }
}
