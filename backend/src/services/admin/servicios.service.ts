import { supabaseAdmin } from '../../supabase'
import {
  AdminServicioDTO,
  AdminServicioUpdateDTO
} from '../../schemas/admin/servicios.schema'

const like = (q?: string) => `%${(q || '').trim()}%`

export class ServiciosAdminService {

  static async getServicios(q?: string) {
    const query = supabaseAdmin
      .from('servicios')
      .select('*')
      .order('id', { ascending: true })

    const { data, error } = q
      ? await query.or(
          `nombre.ilike.${like(q)},descripcion.ilike.${like(q)}`
        )
      : await query

    if (error) throw new Error('Error obteniendo servicios')
    return data ?? []
  }

  static async createServicio(data: AdminServicioDTO) {
    const { error } =
      await supabaseAdmin
        .from('servicios')
        .insert(data)

    if (error) throw new Error('Error creando servicio')
  }

  static async updateServicio(
    id: string,
    data: AdminServicioUpdateDTO
  ) {
    const { error } =
      await supabaseAdmin
        .from('servicios')
        .update(data)
        .eq('id', id)

    if (error) throw new Error('Error actualizando servicio')
  }

  static async deleteServicio(id: string) {
    const { error } =
      await supabaseAdmin
        .from('servicios')
        .delete()
        .eq('id', id)

    if (error) throw new Error('Error eliminando servicio')
  }
}
