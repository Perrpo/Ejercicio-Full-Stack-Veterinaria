import { Router } from 'express'
import { db } from '../server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const router = Router()

function authAdmin(req: any, res: any, next: any) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: 'No autorizado' })
  const token = header.replace('Bearer ', '')
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    if (payload.rol !== 'admin') return res.status(403).json({ message: 'Requiere rol admin' })
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }
}

// Utilidad para LIKE búsquedas
const like = (q?: string) => `%${(q || '').trim()}%`

// Usuarios CRUD + búsqueda
router.get('/usuarios', authAdmin, async (req, res) => {
  const q = String(req.query.q || '')
  const [rows] = await db.query(
    `SELECT id_usuario, nombre, apellido, email, telefono, direccion, rol, fecha_registro
     FROM usuarios 
     WHERE nombre LIKE ? OR apellido LIKE ? OR email LIKE ? OR telefono LIKE ?
     ORDER BY id_usuario ASC`, [like(q), like(q), like(q), like(q)])
  res.json(rows)
})

const userSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(7),
  direccion: z.string().min(3),
  rol: z.enum(['cliente','veterinario','admin'])
})

router.post('/usuarios', authAdmin, async (req, res) => {
  const p = userSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {nombre, apellido, email, telefono, direccion, rol} = p.data
  await db.query('INSERT INTO usuarios (nombre, apellido, email, password, telefono, direccion, rol, fecha_registro) VALUES (?,?,?,?,?,?,?, NOW())', [nombre, apellido, email, '', telefono, direccion, rol])
  res.status(201).json({message:'Creado'})
})

router.put('/usuarios/:id', authAdmin, async (req, res) => {
  const id = Number(req.params.id)
  const p = userSchema.partial({email:true, rol:true}).safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  await db.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [p.data, id])
  res.json({message:'Actualizado'})
})

router.delete('/usuarios/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id])
  res.json({message:'Eliminado'})
})

// Pacientes
router.get('/pacientes', authAdmin, async (req,res)=>{
  const q = String(req.query.q || '')
  const [rows] = await db.query(
    `SELECT p.*, u.nombre as propietario_nombre, u.apellido as propietario_apellido
     FROM pacientes p JOIN usuarios u ON p.id_usuario = u.id_usuario
     WHERE p.nombre LIKE ? OR p.especie LIKE ? OR p.raza LIKE ? OR u.nombre LIKE ? OR u.apellido LIKE ?
     ORDER BY p.id_paciente ASC`, [like(q), like(q), like(q), like(q), like(q)])
  res.json(rows)
})

const pacienteSchema = z.object({
  id_usuario: z.number().int(),
  nombre: z.string().min(1),
  especie: z.string().min(1),
  raza: z.string().min(1),
  edad: z.number().int().nonnegative(),
  peso: z.number().nonnegative(),
})

router.post('/pacientes', authAdmin, async (req,res)=>{
  const p = pacienteSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {id_usuario, nombre, especie, raza, edad, peso} = p.data
  await db.query('INSERT INTO pacientes (id_usuario, nombre, especie, raza, edad, peso) VALUES (?,?,?,?,?,?)', [id_usuario, nombre, especie, raza, edad, peso])
  res.status(201).json({message:'Creado'})
})

router.put('/pacientes/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const p = pacienteSchema.partial({id_usuario:true}).safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  await db.query('UPDATE pacientes SET ? WHERE id_paciente = ?', [p.data, id])
  res.json({message:'Actualizado'})
})

router.delete('/pacientes/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  await db.query('DELETE FROM pacientes WHERE id_paciente = ?', [id])
  res.json({message:'Eliminado'})
})

// Servicios
router.get('/servicios', authAdmin, async (req,res)=>{
  const q = String(req.query.q || '')
  const [rows] = await db.query('SELECT * FROM servicios WHERE nombre LIKE ? OR descripcion LIKE ? ORDER BY id_servicio ASC', [like(q), like(q)])
  res.json(rows)
})

const servicioSchema = z.object({ nombre: z.string().min(1), descripcion: z.string().min(1), precio: z.number().nonnegative() })

router.post('/servicios', authAdmin, async (req,res)=>{
  const p = servicioSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {nombre, descripcion, precio} = p.data
  await db.query('INSERT INTO servicios (nombre, descripcion, precio) VALUES (?,?,?)', [nombre, descripcion, precio])
  res.status(201).json({message:'Creado'})
})

router.put('/servicios/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const p = servicioSchema.partial().safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  await db.query('UPDATE servicios SET ? WHERE id_servicio = ?', [p.data, id])
  res.json({message:'Actualizado'})
})

router.delete('/servicios/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  await db.query('DELETE FROM servicios WHERE id_servicio = ?', [id])
  res.json({message:'Eliminado'})
})

// Citas
router.get('/citas', authAdmin, async (req,res)=>{
  const q = String(req.query.q || '')
  const [rows] = await db.query(
    `SELECT c.*, u.nombre as cliente_nombre, u.apellido as cliente_apellido, p.nombre as paciente_nombre, s.nombre as servicio_nombre
     FROM citas c 
     JOIN usuarios u ON c.id_usuario = u.id_usuario
     JOIN pacientes p ON c.id_paciente = p.id_paciente
     JOIN servicios s ON c.id_servicio = s.id_servicio
     WHERE u.nombre LIKE ? OR u.apellido LIKE ? OR p.nombre LIKE ? OR s.nombre LIKE ? OR c.estado LIKE ?
     ORDER BY c.id_cita ASC`, [like(q), like(q), like(q), like(q), like(q)])
  res.json(rows)
})

const citaSchema = z.object({
  id_usuario: z.number().int(),
  id_paciente: z.number().int(),
  id_servicio: z.number().int(),
  fecha_cita: z.string(),
  estado: z.enum(['pendiente','confirmada','completada','cancelada'])
})

router.post('/citas', authAdmin, async (req,res)=>{
  const p = citaSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {id_usuario, id_paciente, id_servicio, fecha_cita, estado} = p.data
  await db.query('INSERT INTO citas (id_usuario, id_paciente, id_servicio, fecha_cita, estado) VALUES (?,?,?,?,?)', [id_usuario, id_paciente, id_servicio, fecha_cita, estado])
  res.status(201).json({message:'Creado'})
})

router.put('/citas/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const p = citaSchema.partial({id_usuario:true, id_paciente:true, id_servicio:true}).safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  await db.query('UPDATE citas SET ? WHERE id_cita = ?', [p.data, id])
  res.json({message:'Actualizado'})
})

router.delete('/citas/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  await db.query('DELETE FROM citas WHERE id_cita = ?', [id])
  res.json({message:'Eliminado'})
})

// Pagos
router.get('/pagos', authAdmin, async (req,res)=>{
  const q = String(req.query.q || '')
  const [rows] = await db.query(
    `SELECT pa.*, c.fecha_cita, u.nombre as cliente_nombre, p.nombre as paciente_nombre, s.nombre as servicio_nombre
     FROM pagos pa
     JOIN citas c ON pa.id_cita = c.id_cita
     JOIN usuarios u ON c.id_usuario = u.id_usuario
     JOIN pacientes p ON c.id_paciente = p.id_paciente
     JOIN servicios s ON c.id_servicio = s.id_servicio
     WHERE u.nombre LIKE ? OR p.nombre LIKE ? OR s.nombre LIKE ? OR pa.estado LIKE ? OR pa.metodo_pago LIKE ?
     ORDER BY pa.id_pago ASC`, [like(q), like(q), like(q), like(q), like(q)])
  res.json(rows)
})

const pagoSchema = z.object({ id_cita: z.number().int(), metodo_pago: z.enum(['tarjeta_credito','efectivo','transferencia']), monto: z.number().nonnegative(), fecha_pago: z.string(), estado: z.enum(['pendiente','pagado','fallido']) })

router.post('/pagos', authAdmin, async (req,res)=>{
  const p = pagoSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {id_cita, metodo_pago, monto, fecha_pago, estado} = p.data
  await db.query('INSERT INTO pagos (id_cita, metodo_pago, monto, fecha_pago, estado) VALUES (?,?,?,?,?)', [id_cita, metodo_pago, monto, fecha_pago, estado])
  res.status(201).json({message:'Creado'})
})

router.put('/pagos/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const p = pagoSchema.partial().safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  await db.query('UPDATE pagos SET ? WHERE id_pago = ?', [p.data, id])
  res.json({message:'Actualizado'})
})

router.delete('/pagos/:id', authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  await db.query('DELETE FROM pagos WHERE id_pago = ?', [id])
  res.json({message:'Eliminado'})
})

export default router


