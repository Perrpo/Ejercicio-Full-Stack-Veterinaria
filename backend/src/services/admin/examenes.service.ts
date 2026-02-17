import { supabaseAdmin } from '../../supabase'
import {
  AdminExamenDTO,
  AdminExamenUpdateDTO
} from '../../schemas/admin/examenes.schema'

const like = (q?: string) => `%${(q || '').trim()}%`

export class ExamenesAdminService {

  static async getExamenes(q?: string) {
    const query = supabaseAdmin
      .from('examenes')
      .select(`
        id,
        nombre,
        descripcion,
        id_paciente,
        pacientes(nombre),
        fecha
      `)
      .order('fecha', { ascending: false })

    const { data, error } = q
      ? await query.or(
          `nombre.ilike.${like(q)},descripcion.ilike.${like(q)}`
        )
      : await query

    if (error) throw new Error('Error obteniendo examenes')
    return data ?? []
  }

  static async createExamen(data: AdminExamenDTO) {
    const { error } =
      await supabaseAdmin
        .from('examenes')
        .insert(data)

    if (error) throw new Error('Error creando examen')
  }

  static async updateExamen(
    id: string,
    data: AdminExamenUpdateDTO
  ) {
    const { error } =
      await supabaseAdmin
        .from('examenes')
        .update(data)
        .eq('id', id)

    if (error) throw new Error('Error actualizando examen')
  }

  static async deleteExamen(id: string) {
    const { error } =
      await supabaseAdmin
        .from('examenes')
        .delete()
        .eq('id', id)

    if (error) throw new Error('Error eliminando examen')
  }
}
