export class CitasService {
  static async getCitas(userId: string, supabase: any) {
    const { data: citasRaw, error } = await supabase
      .from('citas')
      .select(`
        id_cita,
        fecha_cita,
        estado,
        pacientes(nombre),
        servicios(nombre, precio)
      `)
      .eq('id_usuario', userId)
      .order('fecha_cita', { ascending: false })

    if (error) throw new Error('Error al obtener citas')

    return (citasRaw || []).map((c: any) => ({
      id_cita: c.id_cita,
      fecha_cita: c.fecha_cita,
      estado: c.estado,
      paciente_nombre: c.pacientes?.nombre,
      servicio_nombre: c.servicios?.nombre,
       precio: c.servicios?.precio ?? 0,
    }))
  }

  static async createCita(userId: string, data: any, supabase: any) {
    const {
      id_paciente,
      id_servicio,
      fecha_cita,
      observaciones,
    } = data

    // 1️⃣ Verificar que la mascota pertenece al usuario
    const { data: paciente, error: pacienteError } = await supabase
      .from('pacientes')
      .select('id_paciente')
      .eq('id_paciente', Number(id_paciente))
      .eq('id_usuario', userId)
      .maybeSingle()

    if (pacienteError) throw new Error('Error validando mascota')
    if (!paciente) throw new Error('Mascota no válida')

    // 2️⃣ Crear la cita
    const { data: cita, error } = await supabase
      .from('citas')
      .insert({
        id_usuario: userId,
        id_paciente: Number(id_paciente),
        id_servicio: Number(id_servicio),
        fecha_cita,
        estado: 'pendiente',
      })
      .select('id_cita')
      .single()

    if (error) throw new Error('Error al crear cita')

    // 3️⃣ RESPUESTA COMPATIBLE CON FRONT
    return {
      message: 'Cita agendada exitosamente',
      id: cita.id_cita,
    }
  }
}
