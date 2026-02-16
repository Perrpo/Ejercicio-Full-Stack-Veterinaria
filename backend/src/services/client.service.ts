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

static async deleteMascota(userId: string, petId: number, supabase: any) {
  // verificar que la mascota es del usuario
  const { data: pet } = await supabase
    .from('pacientes')
    .select('id_paciente')
    .eq('id_paciente', petId)
    .eq('id_usuario', userId)
    .maybeSingle()

  if (!pet) {
    throw new Error('Mascota no encontrada')
  }

  const { error } = await supabase
    .from('pacientes')
    .delete()
    .eq('id_paciente', petId)

  if (error) {
    throw new Error('Error al eliminar mascota')
  }
}

static async getCitas(userId: string, supabase: any) {
  const { data, error } = await supabase
    .from('citas')
    .select(`
      id_cita,
      fecha,
      estado,
      pacientes (
        id_paciente,
        nombre
      ),
      servicios (
        id_servicio,
        nombre
      )
    `)
    .eq('id_usuario', userId)
    .order('fecha', { ascending: false })

  if (error) {
    throw new Error('Error al obtener citas')
  }

  return data
}

static async createCita(userId: string, data: any, supabase: any) {
  const {
    id_paciente,
    id_servicio,
    fecha,
    observaciones
  } = data

  // Validación mínima
  if (!id_paciente || !id_servicio || !fecha) {
    throw new Error('Datos incompletos para la cita')
  }

  // Verificar que la mascota es del usuario
  const { data: paciente } = await supabase
    .from('pacientes')
    .select('id_paciente')
    .eq('id_paciente', id_paciente)
    .eq('id_usuario', userId)
    .maybeSingle()

  if (!paciente) {
    throw new Error('Mascota no válida')
  }

  const { data: cita, error } = await supabase
    .from('citas')
    .insert({
      id_usuario: userId,
      id_paciente,
      id_servicio,
      fecha,
      observaciones,
      estado: 'pendiente'
    })
    .select()
    .single()

  if (error) {
    throw new Error('Error al crear cita')
  }

  return cita
}

}
