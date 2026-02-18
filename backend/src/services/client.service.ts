export class ClientService {

  // ======================
  // Dashboard
  // ======================
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

  // ======================
  // Mascotas / Pacientes
  // ======================
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

  // ======================
  // Perfil
  // ======================
  static async getProfile(userId: string, supabase: any) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, apellido, email, telefono, direccion')
      .eq('id_usuario', userId)
      .maybeSingle()

    if (error || !data) throw new Error('Perfil no encontrado')
    return data
  }

  static async updateProfile(userId: string, data: any, supabase: any) {
    const updates: any = {}
    // Solo incluir campos que fueron enviados
    if ('nombre' in data) updates.nombre = data.nombre
    if ('apellido' in data) updates.apellido = data.apellido
    if ('telefono' in data) updates.telefono = data.telefono
    if ('direccion' in data) updates.direccion = data.direccion

    if (Object.keys(updates).length === 0) {
      throw new Error('No hay datos para actualizar')
    }

    const { error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id_usuario', userId)

    if (error) {
      console.error('[ClientService] Error actualizando perfil:', { userId, error })
      throw new Error(`Error al actualizar perfil: ${error.message}`)
    }
  }

  // ======================
  // Citas
  // ======================
  static async getCitas(userId: string, supabase: any) {
    const { data: citasRaw, error } = await supabase
      .from('citas')
      .select(`id_cita, fecha_cita, estado, pacientes(nombre), servicios(nombre)`)
      .eq('id_usuario', userId)
      .order('fecha_cita', { ascending: false })

    if (error) throw new Error('Error al obtener citas')

    return (citasRaw || []).map((c: any) => ({
      id_cita: c.id_cita,
      fecha_cita: c.fecha_cita,
      estado: c.estado,
      paciente_nombre: c.pacientes?.nombre,
      servicio_nombre: c.servicios?.nombre,
    }))
  }

  static async createCita(userId: string, data: any, supabase: any) {
    const { id_paciente, id_servicio, fecha_cita, observaciones } = data
    if (!id_paciente || !id_servicio || !fecha_cita) {
      throw new Error('Datos incompletos para la cita')
    }

    const { data: paciente, error: pacienteError } = await supabase
      .from('pacientes')
      .select('id_paciente')
      .eq('id_paciente', id_paciente)
      .eq('id_usuario', userId)
      .maybeSingle()

    if (pacienteError) {
      console.error('[ClientService] Error verificando paciente:', pacienteError)
      throw new Error('Error al verificar mascota')
    }

    if (!paciente) throw new Error('Mascota no válida o no pertenece a este usuario')

    const { data: cita, error } = await supabase
      .from('citas')
      .insert({
        id_usuario: userId,
        id_paciente,
        id_servicio,
        fecha_cita,
        observaciones: observaciones || null,
        estado: 'pendiente',
      })
      .select()
      .single()

    if (error) {
      console.error('[ClientService] Error creando cita:', { userId, id_paciente, id_servicio, error })
      throw new Error(`Error al crear cita: ${error.message}`)
    }
    return cita
  }

  // ======================
  // Exámenes
  // ======================
  static async getExamenes(userId: string, supabase: any) {
    const { data, error } = await supabase
      .from('examenes')
      .select(`
        id_examen,
        tipo_examen,
        fecha_examen,
        resultado,
        observaciones,
        estado,
        pacientes(id_paciente, nombre)
      `)
      .eq('pacientes.id_usuario', userId)
      .order('fecha_examen', { ascending: false })

    if (error) throw new Error('Error al obtener exámenes')

    return (data || []).map((e: any) => ({
      id_examen: e.id_examen,
      tipo_examen: e.tipo_examen,
      fecha_examen: e.fecha_examen,
      resultado: e.resultado,
      observaciones: e.observaciones,
      estado: e.estado,
      paciente_nombre: e.pacientes?.nombre,
    }))
  }

  static async createExamen(userId: string, data: any, supabase: any) {
    const { id_paciente, tipo_examen, observaciones } = data
    if (!id_paciente || !tipo_examen) throw new Error('Datos incompletos para el examen')

    const { data: paciente, error: pacienteError } = await supabase
      .from('pacientes')
      .select('id_paciente')
      .eq('id_paciente', id_paciente)
      .eq('id_usuario', userId)
      .maybeSingle()

    if (pacienteError) {
      console.error('[ClientService] Error verificando paciente para examen:', pacienteError)
      throw new Error('Error al verificar mascota')
    }

    if (!paciente) throw new Error('Mascota no válida o no pertenece a este usuario')

    const { data: examen, error } = await supabase
      .from('examenes')
      .insert({
        id_paciente,
        tipo_examen,
        observaciones: observaciones || null,
        fecha_examen: new Date().toISOString(),
        estado: 'pendiente',
      })
      .select()
      .single()

    if (error) {
      console.error('[ClientService] Error creando examen:', { userId, id_paciente, tipo_examen, error })
      throw new Error(`Error al crear examen: ${error.message}`)
    }
    return examen
  }
}