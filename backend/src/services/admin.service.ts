import { supabaseAdmin } from '../supabase'

const like = (q?: string) => `%${(q || '').trim()}%`

export class AdminService {

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

  static async createUsuario(data: any) {
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

  static async updateUsuario(id: string, data: any) {
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
}
