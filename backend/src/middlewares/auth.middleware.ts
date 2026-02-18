import { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../supabase'
import { supabaseForUser } from '../supabase'

export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    req.supabase = supabaseForUser(token)

    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data.user) {
      return res.status(401).json({ message: 'Token inválido' })
    }

    // El id_usuario debe ser el UUID del usuario autenticado de Supabase
    const authUserId = data.user.id

    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('usuarios')
      .select('id_usuario, rol, nombre, apellido')
      .eq('id_usuario', authUserId)
      .maybeSingle()

    if (perfilError || !perfil) {
      return res.status(403).json({ message: 'Perfil no encontrado' })
    }

    req.user = {
      sub: authUserId, // Usar el UUID de Supabase, no el id_usuario local
      rol: perfil.rol,
      nombre: perfil.nombre,
      apellido: perfil.apellido,
    }

    next()
  } catch {
    res.status(401).json({ message: 'Token inválido' })
  }
}
