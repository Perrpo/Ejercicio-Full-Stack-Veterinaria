import { Router, Request, Response, NextFunction } from 'express'
import { authUser } from './auth'
import { z } from 'zod'

const router = Router()

// Middleware para verificar que el usuario es cliente
function authCliente(req: Request, res: Response, next: NextFunction) {
  if (req.user?.rol !== 'cliente') {
    return res.status(403).json({ message: 'Acceso denegado' })
  }
  next()
}

// Obtener datos del dashboard del cliente
router.get('/dashboard', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })
    
    // Obtener pacientes del usuario
    const { data: pacientes, error: pacientesError } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id_usuario', userId)
    if (pacientesError) return res.status(500).json({ message: 'Error interno del servidor' })
    
    // Obtener citas del usuario
    const { data: citasRaw, error: citasError } = await supabase
      .from('citas')
      .select('id_cita, id_usuario, id_paciente, id_servicio, fecha_cita, estado, pacientes(nombre), servicios(nombre)')
      .eq('id_usuario', userId)
      .order('fecha_cita', { ascending: false })
    if (citasError) return res.status(500).json({ message: 'Error interno del servidor' })

    const citas = (citasRaw || []).map((c: any) => ({
      ...c,
      paciente_nombre: c.pacientes?.nombre,
      servicio_nombre: c.servicios?.nombre,
    }))
    
    // Obtener pagos del usuario
    const { data: pagosRaw, error: pagosError } = await supabase
      .from('pagos')
      .select('id_pago, id_cita, metodo_pago, monto, fecha_pago, estado, citas!inner(id_usuario, servicios(nombre))')
      .eq('citas.id_usuario', userId)
      .order('fecha_pago', { ascending: false })
    if (pagosError) return res.status(500).json({ message: 'Error interno del servidor' })

    const pagos = (pagosRaw || []).map((p: any) => ({
      id_pago: p.id_pago,
      id_cita: p.id_cita,
      metodo_pago: p.metodo_pago,
      monto: p.monto,
      fecha_pago: p.fecha_pago,
      estado: p.estado,
      servicio_nombre: p.citas?.servicios?.nombre,
    }))
    
    // Obtener examenes del usuario (si tienes tabla de examenes)
    const { data: examenesRaw, error: examenesError } = await supabase
      .from('examenes')
      .select('id_examen, id_paciente, tipo_examen, fecha_examen, resultado, observaciones, estado, pacientes!inner(id_usuario, nombre)')
      .eq('pacientes.id_usuario', userId)
      .order('fecha_examen', { ascending: false })
    if (examenesError) return res.status(500).json({ message: 'Error interno del servidor' })

    const examenes = (examenesRaw || []).map((e: any) => ({
      id_examen: e.id_examen,
      id_paciente: e.id_paciente,
      tipo_examen: e.tipo_examen,
      fecha_examen: e.fecha_examen,
      resultado: e.resultado,
      observaciones: e.observaciones,
      estado: e.estado,
      paciente_nombre: e.pacientes?.nombre,
    }))
    
    res.json({
      pacientes,
      citas,
      pagos,
      examenes
    })
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener mascotas del cliente
router.get('/mascotas', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('id_usuario', userId)
      .order('nombre', { ascending: true })

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })
    res.json(data || [])
  } catch (error) {
    console.error('Error al obtener mascotas:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Agregar nueva mascota
router.post('/mascotas', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const { nombre, especie, raza, edad, peso } = req.body
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const schema = z.object({
      nombre: z.string().min(1),
      especie: z.string().min(1),
      raza: z.string().min(1),
      edad: z.union([z.number().int().nonnegative(), z.string().transform(v => Number(v))]),
      peso: z.union([z.number().nonnegative(), z.string().transform(v => Number(v))]),
    })
    const parsed = schema.safeParse({ nombre, especie, raza, edad, peso })
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })

    const { data, error } = await supabase
      .from('pacientes')
      .insert({ id_usuario: userId, ...parsed.data })
      .select('id_paciente')
      .single()

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })

    res.status(201).json({ 
      message: 'Mascota registrada exitosamente',
      id: data.id_paciente 
    })
  } catch (error) {
    console.error('Error al registrar mascota:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Eliminar mascota
router.delete('/mascotas/:id', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const petId = parseInt(req.params.id)
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })
    
    // Verificar que la mascota pertenece al usuario
    const { data: existingPet, error: existingPetError } = await supabase
      .from('pacientes')
      .select('id_paciente')
      .eq('id_paciente', petId)
      .eq('id_usuario', userId)
      .maybeSingle()

    if (existingPetError) return res.status(500).json({ message: 'Error interno del servidor' })
    
    if (!existingPet) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }
    
    // Eliminar la mascota
    const { error } = await supabase.from('pacientes').delete().eq('id_paciente', petId)
    if (error) return res.status(500).json({ message: 'Error interno del servidor' })
    
    res.json({ message: 'Mascota eliminada exitosamente' })
  } catch (error) {
    console.error('Error al eliminar mascota:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener citas del cliente
router.get('/citas', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const { data: citasRaw, error } = await supabase
      .from('citas')
      .select('id_cita, id_usuario, id_paciente, id_servicio, fecha_cita, estado, pacientes(nombre), servicios(nombre,precio)')
      .eq('id_usuario', userId)
      .order('fecha_cita', { ascending: false })

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })

    const citas = (citasRaw || []).map((c: any) => ({
      ...c,
      paciente_nombre: c.pacientes?.nombre,
      servicio_nombre: c.servicios?.nombre,
      precio: c.servicios?.precio,
    }))
    
    // Formatear precios para las citas
    const citasFormateadas = citas.map((cita: any) => ({
      ...cita,
      precio_formateado: cita.precio.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
      })
    }))
    
    res.json(citasFormateadas)
  } catch (error) {
    console.error('Error al obtener citas:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Crear nueva cita
router.post('/citas', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const { id_paciente, id_servicio, fecha_cita } = req.body
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const schema = z.object({
      id_paciente: z.union([z.number().int(), z.string().transform(v => Number(v))]),
      id_servicio: z.union([z.number().int(), z.string().transform(v => Number(v))]),
      fecha_cita: z.string().min(1),
    })
    const parsed = schema.safeParse({ id_paciente, id_servicio, fecha_cita })
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })
    
    const { data, error } = await supabase
      .from('citas')
      .insert({ id_usuario: userId, ...parsed.data, estado: 'pendiente' })
      .select('id_cita')
      .single()

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })
    
    res.status(201).json({ 
      message: 'Cita agendada exitosamente',
      id: data.id_cita 
    })
  } catch (error) {
    console.error('Error al agendar cita:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener servicios disponibles
router.get('/servicios', authUser, authCliente, async (req, res) => {
  try {
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const { data: servicios, error } = await supabase
      .from('servicios')
      .select('*')
      .order('nombre', { ascending: true })

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })
    
    // Formatear precios para el cliente (con separador de miles)
    const serviciosFormateados = (servicios || []).map((servicio: any) => ({
      ...servicio,
      precio_formateado: servicio.precio.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true
      })
    }))
    
    res.json(serviciosFormateados)
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener pagos del cliente
router.get('/pagos', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const { data: pagosRaw, error } = await supabase
      .from('pagos')
      .select('id_pago, id_cita, metodo_pago, monto, fecha_pago, estado, citas!inner(id_usuario, fecha_cita, servicios(nombre))')
      .eq('citas.id_usuario', userId)
      .order('fecha_pago', { ascending: false })

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })

    const pagos = (pagosRaw || []).map((p: any) => ({
      id_pago: p.id_pago,
      id_cita: p.id_cita,
      metodo_pago: p.metodo_pago,
      monto: p.monto,
      fecha_pago: p.fecha_pago,
      estado: p.estado,
      servicio_nombre: p.citas?.servicios?.nombre,
      fecha_cita: p.citas?.fecha_cita,
    }))
    res.json(pagos)
  } catch (error) {
    console.error('Error al obtener pagos:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener exámenes del cliente
router.get('/examenes', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const { data: examenesRaw, error } = await supabase
      .from('examenes')
      .select('id_examen, id_paciente, tipo_examen, fecha_examen, resultado, observaciones, estado, pacientes!inner(id_usuario, nombre)')
      .eq('pacientes.id_usuario', userId)
      .order('fecha_examen', { ascending: false })

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })

    const examenes = (examenesRaw || []).map((e: any) => ({
      id_examen: e.id_examen,
      id_paciente: e.id_paciente,
      tipo_examen: e.tipo_examen,
      fecha_examen: e.fecha_examen,
      resultado: e.resultado,
      observaciones: e.observaciones,
      estado: e.estado,
      paciente_nombre: e.pacientes?.nombre,
    }))
    res.json(examenes)
  } catch (error) {
    console.error('Error al obtener exámenes:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Crear nuevo examen
router.post('/examenes', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const { id_paciente, tipo_examen, observaciones } = req.body
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const schema = z.object({
      id_paciente: z.union([z.number().int(), z.string().transform(v => Number(v))]),
      tipo_examen: z.string().min(1),
      observaciones: z.string().optional(),
    })
    const parsed = schema.safeParse({ id_paciente, tipo_examen, observaciones })
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })
    
    // Verificar que la mascota pertenece al usuario
    const { data: existingPet, error: existingPetError } = await supabase
      .from('pacientes')
      .select('id_paciente')
      .eq('id_paciente', parsed.data.id_paciente)
      .eq('id_usuario', userId)
      .maybeSingle()

    if (existingPetError) return res.status(500).json({ message: 'Error interno del servidor' })
    
    if (!existingPet) {
      return res.status(403).json({ message: 'Mascota no encontrada' })
    }
    
    const { data, error } = await supabase
      .from('examenes')
      .insert({
        id_paciente: parsed.data.id_paciente,
        tipo_examen: parsed.data.tipo_examen,
        fecha_examen: new Date().toISOString(),
        observaciones: parsed.data.observaciones || '',
        estado: 'pendiente',
      })
      .select('id_examen')
      .single()

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })
    
    res.status(201).json({ 
      message: 'Examen solicitado exitosamente',
      id: data.id_examen 
    })
  } catch (error) {
    console.error('Error al solicitar examen:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener perfil del cliente
router.get('/perfil', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const { data, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, apellido, email, telefono, direccion')
      .eq('id_usuario', userId)
      .maybeSingle()

    if (error) return res.status(500).json({ message: 'Error interno del servidor' })
    if (!data) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(data)
  } catch (error) {
    console.error('Error al obtener perfil:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Actualizar perfil del cliente
router.put('/perfil', authUser, authCliente, async (req, res) => {
  try {
    const userId = req.user.sub
    const { nombre, apellido, telefono, direccion } = req.body

    const supabase = req.supabase
    if (!supabase) return res.status(500).json({ message: 'Cliente no configurado' })

    const schema = z.object({
      nombre: z.string().min(2).optional(),
      apellido: z.string().min(2).optional(),
      telefono: z.string().min(7).optional(),
      direccion: z.string().min(3).optional(),
    })
    const parsed = schema.safeParse({ nombre, apellido, telefono, direccion })
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() })

    const { error } = await supabase.from('usuarios').update(parsed.data).eq('id_usuario', userId)
    if (error) return res.status(500).json({ message: 'Error interno del servidor' })
    
    res.json({ message: 'Perfil actualizado exitosamente' })
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

export default router
