import { supabaseAdmin } from '../../supabase'
import {
  AdminPacienteDTO,
  AdminPacienteUpdateDTO
} from '../../schemas/admin/pacientes.schema'

const like = (q?: string) => `%${(q || '').trim()}%`

export class PacientesAdminService {

  static async getPacientes(q?: string) {
    const query = supabaseAdmin
      .from('pacientes')
      .select(`
        id,
        nombre,
        especie,
        raza,
        edad,
        peso,
        usuarios (
          nombre,
          apellido,
          email
        )
      `)
      .order('nombre')

    const { data, error } = q
      ? await query.or(
          `nombre.ilike.${like(q)},especie.ilike.${like(q)},raza.ilike.${like(q)}`
        )
      : await query

    if (error) throw new Error('Error obteniendo pacientes')
    return data ?? []
  }

  static async createPaciente(data: AdminPacienteDTO) {
    const { error } =
      await supabaseAdmin
        .from('pacientes')
        .insert(data)

    if (error) throw new Error('Error creando paciente')
  }

  static async updatePaciente(
    id: string,
    data: AdminPacienteUpdateDTO
  ) {
    const { error } =
      await supabaseAdmin
        .from('pacientes')
        .update(data)
        .eq('id', id)

    if (error) throw new Error('Error actualizando paciente')
  }

  static async deletePaciente(id: string) {
    const { error } =
      await supabaseAdmin
        .from('pacientes')
        .delete()
        .eq('id', id)

    if (error) throw new Error('Error eliminando paciente')
  }
}
