export class ExamenesService {
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

    const { data: paciente } = await supabase
      .from('pacientes')
      .select('id_paciente')
      .eq('id_paciente', id_paciente)
      .eq('id_usuario', userId)
      .maybeSingle()

    if (!paciente) throw new Error('Mascota no válida')

    const { data: examen, error } = await supabase
      .from('examenes')
      .insert({
        id_paciente,
        tipo_examen,
        observaciones: observaciones || '',
        fecha_examen: new Date().toISOString(),
        estado: 'pendiente',
      })
      .select()
      .single()

    if (error) throw new Error('Error al crear examen')

    return examen
  }
}
