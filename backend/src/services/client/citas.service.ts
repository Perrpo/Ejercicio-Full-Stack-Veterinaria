export class CitasService {
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

    const { data: paciente } = await supabase
      .from('pacientes')
      .select('id_paciente')
      .eq('id_paciente', id_paciente)
      .eq('id_usuario', userId)
      .maybeSingle()

    if (!paciente) throw new Error('Mascota no válida')

    const { data: cita, error } = await supabase
      .from('citas')
      .insert({
        id_usuario: userId,
        id_paciente,
        id_servicio,
        fecha_cita,
        observaciones: observaciones || '',
        estado: 'pendiente',
      })
      .select()
      .single()

    if (error) throw new Error('Error al crear cita')
    return cita
  }
}
