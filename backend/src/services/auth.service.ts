import { LoginDTO, RegisterDTO } from '../schemas/auth.schema'
import { supabaseAdmin, supabaseAnon } from '../supabase'

export class AuthService {
  static async register(data: RegisterDTO) {
    const { nombre, apellido, email, password, telefono, direccion } = data

    const { data: signup, error } = await supabaseAnon.auth.signUp({
      email,
      password,
    })

    if (error || !signup.user) {
      throw new Error('Error en registro')
    }

    const { error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id_usuario: signup.user.id,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        rol: 'cliente',
      })

    if (insertError) {
      throw new Error('Error al crear perfil')
    }
  }

  static async login(data: LoginDTO) {
    const { email, password } = data

    const { data: auth, error } =
      await supabaseAnon.auth.signInWithPassword({
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
