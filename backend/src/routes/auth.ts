import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { supabaseAdmin, supabaseAnon } from '../supabase'
import { supabaseForUser } from '../supabase'

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any
      supabase?: any
    }
  }
}

// Middleware para verificar token (Supabase)
export function authUser(req: Request, res: Response, next: NextFunction) {
  ;(async () => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }

    req.supabase = supabaseForUser(token)

    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data.user) {
      return res.status(401).json({ message: 'Token inválido' })
    }

    const authUserId = data.user.id

    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('usuarios')
      .select('id_usuario, rol, nombre, apellido')
      .eq('id_usuario', authUserId)
      .maybeSingle()

    if (perfilError) {
      return res.status(500).json({ message: 'Error al cargar perfil' })
    }

    if (!perfil) {
      return res.status(403).json({ message: 'Perfil no encontrado' })
    }

    req.user = { sub: perfil.id_usuario, rol: perfil.rol, nombre: perfil.nombre, apellido: perfil.apellido }
    next()
  })().catch(() => {
    return res.status(401).json({ message: 'Token inválido' })
  })
}

const router = Router()

const registerSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  telefono: z.string().min(7),
  direccion: z.string().min(3),
})

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })
  const { nombre, apellido, email, password, telefono, direccion } = parsed.data
  try {
    const { data, error } = await supabaseAnon.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('Supabase signUp error:', error)
      const msg = error.message || 'Error en registro'
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')) {
        return res.status(409).json({ message: 'Email ya registrado' })
      }
      return res.status(500).json({ message: 'Error en registro', error: process.env.NODE_ENV === 'development' ? msg : undefined })
    }

    const user = data.user
    if (!user) {
      console.error('Supabase signUp returned no user:', data)
      return res.status(500).json({ message: 'Error en registro', error: process.env.NODE_ENV === 'development' ? 'signUp returned no user' : undefined })
    }

    const { error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        id_usuario: user.id,
        nombre,
        apellido,
        email,
        telefono,
        direccion,
        rol: 'cliente',
      })

    if (insertError) {
      console.error('Supabase insert usuarios error:', insertError)
      return res.status(500).json({ message: 'Error en registro', error: process.env.NODE_ENV === 'development' ? insertError.message : undefined })
    }

    res.status(201).json({ message: 'Usuario registrado' })
  } catch (e) {
    const err = e as any
    console.error('Register unexpected error:', err)
    res.status(500).json({
      message: 'Error en registro',
      error: process.env.NODE_ENV === 'development' ? (err?.message || String(err)) : undefined,
    })
  }
})

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) })

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })
  const { email, password } = parsed.data
  try {
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session || !data.user) {
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    const token = data.session.access_token

    const { data: perfiles, error: perfilError } = await supabaseAdmin
      .from('usuarios')
      .select('id_usuario, nombre, apellido, rol')
      .eq('id_usuario', data.user.id)

    if (perfilError) {
      console.error('Login perfil lookup error:', perfilError)
      return res.status(500).json({ message: 'Error en login', error: process.env.NODE_ENV === 'development' ? perfilError.message : undefined })
    }

    if (!perfiles || perfiles.length === 0) {
      console.error('Login perfil no encontrado para user.id:', data.user.id)
      return res.status(500).json({ message: 'Error en login', error: process.env.NODE_ENV === 'development' ? 'perfil no encontrado' : undefined })
    }

    const perfil = perfiles[0] // Tomar el primer resultado

    res.json({ token, user: { id: perfil.id_usuario, nombre: perfil.nombre, apellido: perfil.apellido, rol: perfil.rol } })
  } catch (e) {
    const err = e as any
    console.error('Login unexpected error:', err)
    res.status(500).json({
      message: 'Error en login',
      error: process.env.NODE_ENV === 'development' ? (err?.message || String(err)) : undefined,
    })
  }
})

export default router


