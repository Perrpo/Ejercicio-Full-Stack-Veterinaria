import { supabaseAdmin } from '../supabase'
import { AdminCitaDTO, AdminCitaUpdateDTO, AdminExamenDTO, AdminExamenUpdateDTO, AdminPacienteDTO, AdminPacienteUpdateDTO, AdminPagoDTO, AdminPagoUpdateDTO, AdminServicioDTO, AdminServicioUpdateDTO, AdminUserDTO, AdminUserUpdateDTO } from '../schemas/adminUser.schema'

const like = (q?: string) => `%${(q || '').trim()}%`

export class AdminService {

  // ======================
  // usuarios
  // ======================
  static async getUsuarios(q?: string) {
    const query = supabaseAdmin
      .from('usuarios')
      .select('id_usuario, nombre, apellido, email, telefono, direccion, rol, fecha_registro')
      .order('fecha_registro', { ascending: false })

    const { data, error } = q
      ? await query.or(
          `nombre.ilike.${like(q)},apellido.ilike.${like(q)},email.ilike.${like(q)},telefono.ilike.${like(q)}`
        )
      : await query

    if (error) throw new Error('Error obteniendo usuarios')
    return data || []
  }

  static async createUsuario(data: AdminUserDTO) {
    const { nombre, apellido, email, telefono, direccion, rol } = data

    const { data: authData, error } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: Math.random().toString(36).slice(2) + 'A1!a',
        email_confirm: true,
      })

    if (error || !authData.user) {
      throw new Error('Error creando usuario auth')
    }

    const { error: insertError } =
      await supabaseAdmin.from('usuarios').insert({
        id_usuario: authData.user.id,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        rol,
      })

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      throw new Error('Error creando perfil')
    }
  }

  static async updateUsuario(id: string, data: AdminUserUpdateDTO) {
    const { error } =
      await supabaseAdmin.from('usuarios').update(data).eq('id_usuario', id)
    if (error) throw new Error('Error actualizando usuario')
  }

  static async deleteUsuario(id: string) {
    await supabaseAdmin.auth.admin.deleteUser(id).catch(() => null)
    const { error } =
      await supabaseAdmin.from('usuarios').delete().eq('id_usuario', id)
    if (error) throw new Error('Error eliminando usuario')
  }

  
  // ======================
  // PACIENTES
  // ======================

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
    const { error } = await supabaseAdmin.from('pacientes').insert(data)
    if (error) throw new Error('Error creando paciente')
  }

  static async updatePaciente(
    id: string,
    data: AdminPacienteUpdateDTO
  ) {
    const { error } = await supabaseAdmin
      .from('pacientes')
      .update(data)
      .eq('id', id)

    if (error) throw new Error('Error actualizando paciente')
  }

  static async deletePaciente(id: string) {
    const { error } = await supabaseAdmin
      .from('pacientes')
      .delete()
      .eq('id', id)

    if (error) throw new Error('Error eliminando paciente')
  }

  // ======================
  // CITAS
  // ======================

  static async getCitas(q?: string) {
    const query = supabaseAdmin
      .from('citas')
      .select(`
        id,
        fecha,
        estado,
        motivo,
        pacientes (
          nombre,
          especie
        ),
        usuarios (
          nombre,
          apellido
        ),
        servicios (
          nombre
        )
      `)
      .order('fecha', { ascending: false })

    const { data, error } = q
      ? await query.or(
          `estado.ilike.${like(q)},motivo.ilike.${like(q)}`
        )
      : await query

    if (error) throw new Error('Error obteniendo citas')
    return data ?? []
  }

  static async createCita(data: AdminCitaDTO) {
    const { error } = await supabaseAdmin
      .from('citas')
      .insert(data)

    if (error) throw new Error('Error creando cita')
  }

  static async updateCita(
    id: string,
    data: AdminCitaUpdateDTO
  ) {
    const { error } = await supabaseAdmin
      .from('citas')
      .update(data)
      .eq('id', id)

    if (error) throw new Error('Error actualizando cita')
  }

  static async deleteCita(id: string) {
    const { error } = await supabaseAdmin
      .from('citas')
      .delete()
      .eq('id', id)

    if (error) throw new Error('Error eliminando cita')
  }

  // ======================
  // EXÁMENES
  // ======================

  static async getExamenes(q?: string) {
    const query = supabaseAdmin
      .from('examenes')
      .select(`
        id,
        nombre,
        descripcion,
        id_paciente,
        pacientes(nombre),
        fecha
      `)
      .order('fecha', { ascending: false })

    const { data, error } = q
      ? await query.or(
          `nombre.ilike.${like(q)},descripcion.ilike.${like(q)}`
        )
      : await query

    if (error) throw new Error('Error obteniendo examenes')
    return data ?? []
  }

  static async createExamen(data: AdminExamenDTO) {
    const { error } = await supabaseAdmin.from('examenes').insert(data)
    if (error) throw new Error('Error creando examen')
  }

  static async updateExamen(id: string, data: AdminExamenUpdateDTO) {
    const { error } = await supabaseAdmin
      .from('examenes')
      .update(data)
      .eq('id', id)
    if (error) throw new Error('Error actualizando examen')
  }

  static async deleteExamen(id: string) {
    const { error } = await supabaseAdmin
      .from('examenes')
      .delete()
      .eq('id', id)
    if (error) throw new Error('Error eliminando examen')
  }

  // ======================
  // SERVICIOS
  // ======================

  static async getServicios(q?: string) {
    const query = supabaseAdmin
      .from('servicios')
      .select('*')
      .order('id', { ascending: true })

    const { data, error } = q
      ? await query.or(`nombre.ilike.${like(q)},descripcion.ilike.${like(q)}`)
      : await query

    if (error) throw new Error('Error obteniendo servicios')
    return data ?? []
  }

  static async createServicio(data: AdminServicioDTO) {
    const { error } = await supabaseAdmin.from('servicios').insert(data)
    if (error) throw new Error('Error creando servicio')
  }

  static async updateServicio(id: string, data: AdminServicioUpdateDTO) {
    const { error } = await supabaseAdmin.from('servicios').update(data).eq('id', id)
    if (error) throw new Error('Error actualizando servicio')
  }

  static async deleteServicio(id: string) {
    const { error } = await supabaseAdmin.from('servicios').delete().eq('id', id)
    if (error) throw new Error('Error eliminando servicio')
  }

  // ======================
  // PAGOS
  // ======================

  static async getPagos(q?: string) {
    const query = supabaseAdmin
      .from('pagos')
      .select(`
        id_pago,
        id_cita,
        metodo_pago,
        monto,
        fecha_pago,
        estado,
        citas(
          fecha_cita,
          usuarios(nombre,apellido),
          pacientes(nombre),
          servicios(nombre)
        )
      `)
      .order('id_pago', { ascending: true })

    const { data, error } = q
      ? await query.or(`metodo_pago.ilike.${like(q)},estado.ilike.${like(q)}`)
      : await query

    if (error) throw new Error('Error obteniendo pagos')

    return (data ?? []).map((r: any) => ({
      id_pago: r.id_pago,
      id_cita: r.id_cita,
      metodo_pago: r.metodo_pago,
      monto: r.monto,
      fecha_pago: r.fecha_pago,
      estado: r.estado,
      fecha_cita: r.citas?.fecha_cita,
      cliente_nombre: r.citas?.usuarios?.nombre,
      paciente_nombre: r.citas?.pacientes?.nombre,
      servicio_nombre: r.citas?.servicios?.nombre,
    }))
  }

  static async createPago(data: AdminPagoDTO) {
    // Verificar que la cita exista
    const { data: citaCheck, error: citaError } =
      await supabaseAdmin.from('citas').select('id_cita').eq('id_cita', data.id_cita).maybeSingle()
    if (citaError || !citaCheck) throw new Error('Cita no encontrada')

    const { data: created, error } =
      await supabaseAdmin.from('pagos').insert(data).select('id_pago').single()

    if (error) throw new Error('Error creando pago')
    return created.id_pago
  }

  static async updatePago(id: string, data: AdminPagoUpdateDTO) {
    if (data.id_cita) {
      const { data: citaCheck, error: citaError } =
        await supabaseAdmin.from('citas').select('id_cita').eq('id_cita', data.id_cita).maybeSingle()
      if (citaError || !citaCheck) throw new Error('Cita no encontrada')
    }

    const { error } = await supabaseAdmin.from('pagos').update(data).eq('id_pago', id)
    if (error) throw new Error('Error actualizando pago')
  }

  static async deletePago(id: string) {
    const { error } = await supabaseAdmin.from('pagos').delete().eq('id_pago', id)
    if (error) throw new Error('Error eliminando pago')
  }
}
