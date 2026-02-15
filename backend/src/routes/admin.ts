import { Router } from 'express'
import { z } from 'zod'
import { authUser } from './auth'
import { supabaseAdmin } from '../supabase'

const router = Router()

function authAdmin(req: any, res: any, next: any) {
  if (req.user?.rol !== 'admin') return res.status(403).json({ message: 'Requiere rol admin' })
  next()
}

// Utilidad para LIKE búsquedas
const like = (q?: string) => `%${(q || '').trim()}%`

// Usuarios CRUD + búsqueda
router.get('/usuarios', authUser, authAdmin, async (req, res) => {
  const q = String(req.query.q || '').trim()

  const query = supabaseAdmin
    .from('usuarios')
    .select('id_usuario, nombre, apellido, email, telefono, direccion, rol, fecha_registro')
    .order('fecha_registro', { ascending: false })

  const { data, error } = q
    ? await query.or(`nombre.ilike.${like(q)},apellido.ilike.${like(q)},email.ilike.${like(q)},telefono.ilike.${like(q)}`)
    : await query

  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json(data || [])
})

const userSchema = z.object({
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(7),
  direccion: z.string().min(3),
  rol: z.enum(['cliente','veterinario','admin'])
})

router.post('/usuarios', authUser, authAdmin, async (req, res) => {
  const p = userSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {nombre, apellido, email, telefono, direccion, rol} = p.data

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: Math.random().toString(36).slice(2) + 'A1!a',
    email_confirm: true,
  })
  if (authError || !authData.user) return res.status(500).json({ message: 'Error interno del servidor' })

  const { error: insertError } = await supabaseAdmin.from('usuarios').insert({
    id_usuario: authData.user.id,
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    rol,
  })
  if (insertError) return res.status(500).json({ message: 'Error interno del servidor' })

  res.status(201).json({message:'Creado'})
})

router.put('/usuarios/:id', authUser, authAdmin, async (req, res) => {
  const id = String(req.params.id)
  const p = userSchema.partial({email:true, rol:true}).safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const { error } = await supabaseAdmin.from('usuarios').update(p.data).eq('id_usuario', id)
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json({message:'Actualizado'})
})

router.delete('/usuarios/:id', authUser, authAdmin, async (req,res)=>{
  const id = String(req.params.id)
  await supabaseAdmin.auth.admin.deleteUser(id).catch(() => null)
  const { error } = await supabaseAdmin.from('usuarios').delete().eq('id_usuario', id)
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json({message:'Eliminado'})
})

// Pacientes
router.get('/pacientes', authUser, authAdmin, async (req,res)=>{
  const q = String(req.query.q || '').trim()
  const query = supabaseAdmin
    .from('pacientes')
    .select('id_paciente, id_usuario, nombre, especie, raza, edad, peso, usuarios(nombre, apellido)')
    .order('id_paciente', { ascending: true })

  const { data, error } = q
    ? await query.or(`nombre.ilike.${like(q)},especie.ilike.${like(q)},raza.ilike.${like(q)}`)
    : await query

  if (error) return res.status(500).json({ message: 'Error interno del servidor' })

  const rows = (data || []).map((r: any) => ({
    ...r,
    propietario_nombre: r.usuarios?.nombre,
    propietario_apellido: r.usuarios?.apellido,
  }))
  res.json(rows)
})

const pacienteSchema = z.object({
  id_usuario: z.string().uuid(),
  nombre: z.string().min(1),
  especie: z.string().min(1),
  raza: z.string().min(1),
  edad: z.number().int().nonnegative(),
  peso: z.number().nonnegative(),
})

router.post('/pacientes', authUser, authAdmin, async (req,res)=>{
  const p = pacienteSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {id_usuario, nombre, especie, raza, edad, peso} = p.data
  const { error } = await supabaseAdmin.from('pacientes').insert({ id_usuario, nombre, especie, raza, edad, peso })
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.status(201).json({message:'Creado'})
})

router.put('/pacientes/:id', authUser, authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const p = pacienteSchema.partial({id_usuario:true}).safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const { error } = await supabaseAdmin.from('pacientes').update(p.data).eq('id_paciente', id)
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json({message:'Actualizado'})
})

router.delete('/pacientes/:id', authUser, authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const { error } = await supabaseAdmin.from('pacientes').delete().eq('id_paciente', id)
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json({message:'Eliminado'})
})

// Servicios
router.get('/servicios', authUser, authAdmin, async (req,res)=>{
  const q = String(req.query.q || '').trim()
  const query = supabaseAdmin.from('servicios').select('*').order('id_servicio', { ascending: true })
  const { data, error } = q
    ? await query.or(`nombre.ilike.${like(q)},descripcion.ilike.${like(q)}`)
    : await query
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json(data || [])
})

const servicioSchema = z.object({ nombre: z.string().min(1), descripcion: z.string().min(1), precio: z.number().nonnegative() })

router.post('/servicios', authUser, authAdmin, async (req,res)=>{
  const p = servicioSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {nombre, descripcion, precio} = p.data
  const { error } = await supabaseAdmin.from('servicios').insert({ nombre, descripcion, precio })
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.status(201).json({message:'Creado'})
})

router.put('/servicios/:id', authUser, authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const p = servicioSchema.partial().safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const { error } = await supabaseAdmin.from('servicios').update(p.data).eq('id_servicio', id)
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json({message:'Actualizado'})
})

router.delete('/servicios/:id', authUser, authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const { error } = await supabaseAdmin.from('servicios').delete().eq('id_servicio', id)
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json({message:'Eliminado'})
})

// Citas
router.get('/citas', authUser, authAdmin, async (req,res)=>{
  const q = String(req.query.q || '').trim()
  const query = supabaseAdmin
    .from('citas')
    .select('id_cita, id_usuario, id_paciente, id_servicio, fecha_cita, estado, usuarios(nombre, apellido), pacientes(nombre), servicios(nombre)')
    .order('id_cita', { ascending: true })

  const { data, error } = q
    ? await query.or(`estado.ilike.${like(q)}`)
    : await query

  if (error) return res.status(500).json({ message: 'Error interno del servidor' })

  const rows = (data || []).map((r: any) => ({
    ...r,
    cliente_nombre: r.usuarios?.nombre,
    cliente_apellido: r.usuarios?.apellido,
    paciente_nombre: r.pacientes?.nombre,
    servicio_nombre: r.servicios?.nombre,
  }))
  res.json(rows)
})

const citaSchema = z.object({
  id_usuario: z.string().uuid(),
  id_paciente: z.number().int(),
  id_servicio: z.number().int(),
  fecha_cita: z.string(),
  estado: z.enum(['pendiente','confirmada','completada','cancelada'])
})

router.post('/citas', authUser, authAdmin, async (req,res)=>{
  const p = citaSchema.safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const {id_usuario, id_paciente, id_servicio, fecha_cita, estado} = p.data
  const { error } = await supabaseAdmin.from('citas').insert({ id_usuario, id_paciente, id_servicio, fecha_cita, estado })
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.status(201).json({message:'Creado'})
})

router.put('/citas/:id', authUser, authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const p = citaSchema.partial({id_usuario:true, id_paciente:true, id_servicio:true}).safeParse(req.body)
  if(!p.success) return res.status(400).json({errors:p.error.flatten()})
  const { error } = await supabaseAdmin.from('citas').update(p.data).eq('id_cita', id)
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json({message:'Actualizado'})
})

router.delete('/citas/:id', authUser, authAdmin, async (req,res)=>{
  const id = Number(req.params.id)
  const { error } = await supabaseAdmin.from('citas').delete().eq('id_cita', id)
  if (error) return res.status(500).json({ message: 'Error interno del servidor' })
  res.json({message:'Eliminado'})
})

// Pagos
router.get('/pagos', authUser, authAdmin, async (req,res)=>{
  try {
    const q = String(req.query.q || '')
    console.log('Obteniendo pagos con búsqueda:', q)

    const { data, error } = await supabaseAdmin
      .from('pagos')
      .select('id_pago, id_cita, metodo_pago, monto, fecha_pago, estado, citas(fecha_cita, usuarios(nombre,apellido), pacientes(nombre), servicios(nombre))')
      .order('id_pago', { ascending: true })

    if (error) return res.status(500).json({message: 'Error interno del servidor'})

    const rows = (data || []).map((r: any) => ({
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

    console.log(`Pagos obtenidos: ${Array.isArray(rows) ? rows.length : 0}`)
    res.json(rows)
  } catch (error) {
    console.error('Error al obtener pagos:', error)
    const message = error instanceof Error ? error.message : 'Error interno'
    res.status(500).json({message: 'Error interno del servidor', error: message})
  }
})

const pagoSchema = z.object({ 
  id_cita: z.union([z.number().int(), z.string().transform(val => Number(val))]), 
  metodo_pago: z.enum(['tarjeta_credito','efectivo','transferencia']), 
  monto: z.union([z.number().nonnegative(), z.string().transform(val => Number(val))]), 
  fecha_pago: z.string().optional().transform(val => {
    if (!val) return val;
    // Convertir fecha ISO a formato MySQL compatible
    return new Date(val).toISOString().slice(0, 19).replace('T', ' ');
  }), 
  estado: z.enum(['pendiente','pagado','fallido']) 
})

router.post('/pagos', authUser, authAdmin, async (req,res)=>{
  try {
    console.log('Datos recibidos para crear pago:', req.body)
    const p = pagoSchema.safeParse(req.body)
    if(!p.success) {
      console.log('Error de validación:', p.error.flatten())
      return res.status(400).json({errors:p.error.flatten()})
    }
    const {id_cita, metodo_pago, monto, fecha_pago, estado} = p.data
    console.log('Datos validados:', {id_cita, metodo_pago, monto, fecha_pago, estado})
    
    // Verificar que la cita existe
    const { data: citaCheck, error: citaError } = await supabaseAdmin.from('citas').select('id_cita').eq('id_cita', id_cita).maybeSingle()
    if (citaError) {
      return res.status(500).json({message: 'Error interno del servidor'})
    }
    if (!citaCheck) {
      return res.status(400).json({message: 'La cita especificada no existe'})
    }
    
    const insertPayload: any = { id_cita, metodo_pago, monto, estado }
    if (fecha_pago) insertPayload.fecha_pago = fecha_pago
    const { data: created, error } = await supabaseAdmin.from('pagos').insert(insertPayload).select('id_pago').single()
    if (error) return res.status(500).json({message: 'Error interno del servidor'})
    res.status(201).json({message:'Creado', id: created.id_pago})
  } catch (error) {
    console.error('Error al crear pago:', error)
    const message = error instanceof Error ? error.message : 'Error interno'
    res.status(500).json({message: 'Error interno del servidor', error: message})
  }
})

router.put('/pagos/:id', authUser, authAdmin, async (req,res)=>{
  try {
    const id = Number(req.params.id)
    console.log('Actualizando pago ID:', id, 'con datos:', req.body)
    
    const p = pagoSchema.partial().safeParse(req.body)
    if(!p.success) {
      console.log('Error de validación:', p.error.flatten())
      return res.status(400).json({errors:p.error.flatten()})
    }
    
    // Verificar que el pago existe
    const { data: pagoCheck, error: pagoError } = await supabaseAdmin.from('pagos').select('id_pago').eq('id_pago', id).maybeSingle()
    if (pagoError) {
      return res.status(500).json({message: 'Error interno del servidor'})
    }
    if (!pagoCheck) {
      return res.status(404).json({message: 'El pago especificado no existe'})
    }
    
    // Si se está actualizando la cita, verificar que existe
    if (p.data.id_cita) {
      const { data: citaCheck, error: citaError } = await supabaseAdmin.from('citas').select('id_cita').eq('id_cita', p.data.id_cita).maybeSingle()
      if (citaError) {
        return res.status(500).json({message: 'Error interno del servidor'})
      }
      if (!citaCheck) {
        return res.status(400).json({message: 'La cita especificada no existe'})
      }
    }
    
    const { error } = await supabaseAdmin.from('pagos').update(p.data).eq('id_pago', id)
    if (error) return res.status(500).json({message: 'Error interno del servidor'})
    console.log('Pago actualizado exitosamente')
    res.json({message:'Actualizado'})
  } catch (error) {
    console.error('Error al actualizar pago:', error)
    const message = error instanceof Error ? error.message : 'Error interno'
    res.status(500).json({message: 'Error interno del servidor', error: message})
  }
})

router.delete('/pagos/:id', authUser, authAdmin, async (req,res)=>{
  try {
    const id = Number(req.params.id)
    console.log('Eliminando pago ID:', id)
    
    // Verificar que el pago existe
    const { data: pagoCheck, error: pagoError } = await supabaseAdmin.from('pagos').select('id_pago').eq('id_pago', id).maybeSingle()
    if (pagoError) {
      return res.status(500).json({message: 'Error interno del servidor'})
    }
    if (!pagoCheck) {
      return res.status(404).json({message: 'El pago especificado no existe'})
    }
    
    const { error } = await supabaseAdmin.from('pagos').delete().eq('id_pago', id)
    if (error) return res.status(500).json({message: 'Error interno del servidor'})
    console.log('Pago eliminado exitosamente')
    res.json({message:'Eliminado'})
  } catch (error) {
    console.error('Error al eliminar pago:', error)
    const message = error instanceof Error ? error.message : 'Error interno'
    res.status(500).json({message: 'Error interno del servidor', error: message})
  }
})

export default router


