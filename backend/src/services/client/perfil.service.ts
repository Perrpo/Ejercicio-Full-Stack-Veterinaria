import { SupabaseClient } from '@supabase/supabase-js' // opcional, si quieres tipar supabase

export class PerfilService {
  static async getProfile(userId: string, supabase: any) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, apellido, email, telefono, direccion')
      .eq('id_usuario', userId)
      .maybeSingle()

    if (error || !data) throw new Error('Perfil no encontrado')
    return data
  }

  static async updateProfile(userId: string, data: any, supabase: any) {
    const { error } = await supabase
      .from('usuarios')
      .update(data)
      .eq('id_usuario', userId)

    if (error) throw new Error('Error al actualizar perfil')
  }
}
