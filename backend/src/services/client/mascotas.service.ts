export class MascotasService {
  static async getMascotas(userId: string, supabase: any) {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id_usuario', userId)

    if (error) throw new Error('Error al obtener mascotas')
    return data
  }

  static async createMascota(userId: string, data: any, supabase: any) {
    const { data: created, error } = await supabase
      .from('pacientes')
      .insert({ id_usuario: userId, ...data })
      .select('id_paciente')
      .single()

    if (error) throw new Error('Error al crear mascota')
    return created.id_paciente
  }

  static async deleteMascota(userId: string, petId: number, supabase: any) {
    const { data: pet } = await supabase
      .from('pacientes')
      .select('id_paciente')
      .eq('id_paciente', petId)
      .eq('id_usuario', userId)
      .maybeSingle()

    if (!pet) throw new Error('Mascota no encontrada')

    const { error } = await supabase
      .from('pacientes')
      .delete()
      .eq('id_paciente', petId)

    if (error) throw new Error('Error al eliminar mascota')
  }
}
