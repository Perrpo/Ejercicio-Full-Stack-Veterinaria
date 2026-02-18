export class DashboardService {
  static async getDashboard(userId: string, supabase: any) {

    // ======================
    // 1️⃣ PACIENTES (igual que antes)
    // ======================
    const { data: pacientes, error: pacientesError } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id_usuario', userId)

    if (pacientesError) {
      throw new Error('Error obteniendo pacientes')
    }

    // ======================
    // 2️⃣ CITAS (igual que antes)
    // ======================
    const { data: citasRaw, error: citasError } = await supabase
      .from('citas')
      .select(`
        id_cita,
        fecha_cita,
        estado,
        pacientes(nombre),
        servicios(nombre)
      `)
      .eq('id_usuario', userId)
      .order('fecha_cita', { ascending: false })

    if (citasError) {
      throw new Error('Error obteniendo citas')
    }

    const citas = (citasRaw || []).map((c: any) => ({
      id_cita: c.id_cita,
      fecha_cita: c.fecha_cita,
      estado: c.estado,
      paciente_nombre: c.pacientes?.nombre ?? null,
      servicio_nombre: c.servicios?.nombre ?? null,
    }))

    // ======================
    // 3️⃣ PAGOS PENDIENTES (SIN romper nada)
    // ======================
    const { count: pagosPendientes } = await supabase
      .from('pagos')
      .select('id_pago', { count: 'exact', head: true })
      .eq('estado', 'pendiente')

    // ======================
    // 4️⃣ EXÁMENES RECIENTES (últimos 7 días)
    // ======================
    const sevenDaysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString()

    const { count: examenesRecientes } = await supabase
      .from('examenes')
      .select('id_examen', { count: 'exact', head: true })
      .gte('fecha_examen', sevenDaysAgo)

    // ======================
    // 5️⃣ RESPUESTA FINAL (COMPATIBLE CON FRONT)
    // ======================
    return {
      pacientes,
      citas,

      // métricas
      tieneMascotas: (pacientes?.length ?? 0) > 0,
      totalMascotas: pacientes?.length ?? 0,
      totalCitas: citas?.length ?? 0,
      pagosPendientes: pagosPendientes ?? 0,
      examenesRecientes: examenesRecientes ?? 0,
    }
  }
}
