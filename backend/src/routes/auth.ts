import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../server'

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

// Middleware para verificar token JWT
export function authUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' })
  }
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
    const [exists] = await db.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email]) as any
    if (exists.length) return res.status(409).json({ message: 'Email ya registrado' })
    const hash = await bcrypt.hash(password, 10)
    await db.query(
      'INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, rol, fecha_registro) VALUES (?,?,?,?,?,?,"cliente", NOW())',
      [nombre, apellido, email, hash, telefono, direccion]
    )
    res.status(201).json({ message: 'Usuario registrado' })
  } catch (e) {
    res.status(500).json({ message: 'Error en registro' })
  }
})

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) })

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })
  const { email, password } = parsed.data
  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]) as any
    if (!rows.length) return res.status(401).json({ message: 'Credenciales inválidas' })
    const user = rows[0]
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' })
    const token = jwt.sign({ sub: user.id_usuario, rol: user.rol }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' })
    res.json({ token, user: { id: user.id_usuario, nombre: user.nombre, apellido: user.apellido, rol: user.rol } })
  } catch (e) {
    res.status(500).json({ message: 'Error en login' })
  }
})

export default router


