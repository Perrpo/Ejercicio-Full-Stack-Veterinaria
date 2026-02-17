import { LoginDTO } from '../../schemas/auth/login.schema'
import { supabaseAnon, supabaseAdmin } from '../../supabase'

export class LoginService {
  static async login(data: LoginDTO) {
    const { email, password } = data

    const { data: auth, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !auth.session || !auth.user) {
      throw new Error('Credenciales inválidas')
    }

    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('usuarios')
      .select('id_usuario, nombre, apellido, rol')
      .eq('id_usuario', auth.user.id)
      .single()

    if (perfilError || !perfil) {
      throw new Error('Perfil no encontrado')
    }

    return {
      token: auth.session.access_token,
      user: {
        id: perfil.id_usuario,
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        rol: perfil.rol,
      },
    }
  }
}
