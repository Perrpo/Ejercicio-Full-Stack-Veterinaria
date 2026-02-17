export class DashboardService {
  static async getDashboard(userId: string, supabase: any) {
    // Pacientes
    const { data: pacientes, error: pacientesError } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id_usuario', userId)
    if (pacientesError) throw new Error('Error obteniendo pacientes')

    // Citas
    const { data: citasRaw, error: citasError } = await supabase
      .from('citas')
      .select('fecha_cita, estado, pacientes(nombre), servicios(nombre)')
      .eq('id_usuario', userId)
    if (citasError) throw new Error('Error obteniendo citas')

    const citas = (citasRaw || []).map((c: any) => ({
      ...c,
      paciente_nombre: c.pacientes?.nombre,
      servicio_nombre: c.servicios?.nombre,
    }))

    return { pacientes, citas }
  }
}
