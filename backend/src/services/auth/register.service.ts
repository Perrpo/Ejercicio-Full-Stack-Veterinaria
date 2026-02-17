import { RegisterDTO } from '../../schemas/auth/register.schema'
import { supabaseAnon, supabaseAdmin } from '../../supabase'

export class RegisterService {
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
}
