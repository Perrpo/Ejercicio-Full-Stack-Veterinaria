export class ClientService {
  static async getDashboard(userId: string, supabase: any) {
    const { data: pacientes } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id_usuario', userId)

    const { data: citasRaw } = await supabase
      .from('citas')
      .select('fecha_cita, estado, pacientes(nombre), servicios(nombre)')
      .eq('id_usuario', userId)

    const citas = (citasRaw || []).map((c: any) => ({
      ...c,
      paciente_nombre: c.pacientes?.nombre,
      servicio_nombre: c.servicios?.nombre,
    }))

    return { pacientes, citas }
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

  static async getProfile(userId: string, supabase: any) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id_usuario, nombre, apellido, email, telefono, direccion')
    .eq('id_usuario', userId)
    .maybeSingle()

  if (error || !data) {
    throw new Error('Perfil no encontrado')
  }

  return data
}

static async updateProfile(userId: string, data: any, supabase: any) {
  const { error } = await supabase
    .from('usuarios')
    .update(data)
    .eq('id_usuario', userId)

  if (error) {
    throw new Error('Error al actualizar perfil')
  }
}

}
