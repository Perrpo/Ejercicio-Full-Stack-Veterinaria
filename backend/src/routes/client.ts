import { Router, Request, Response, NextFunction } from 'express'
import { authUser } from './auth'
import { db } from '../server'
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
    
    // Obtener pacientes del usuario
    const [pacientes] = await db.query(
      'SELECT * FROM pacientes WHERE id_usuario = ?',
      [userId]
    )
    
    // Obtener citas del usuario
    const [citas] = await db.query(
      `SELECT c.*, p.nombre as paciente_nombre, s.nombre as servicio_nombre 
       FROM citas c 
       JOIN pacientes p ON c.id_paciente = p.id_paciente 
       JOIN servicios s ON c.id_servicio = s.id_servicio 
       WHERE c.id_usuario = ? 
       ORDER BY c.fecha_cita DESC`,
      [userId]
    )
    
    // Obtener pagos del usuario
    const [pagos] = await db.query(
      `SELECT pa.*, s.nombre as servicio_nombre 
       FROM pagos pa 
       JOIN citas c ON pa.id_cita = c.id_cita 
       JOIN servicios s ON c.id_servicio = s.id_servicio 
       WHERE c.id_usuario = ? 
       ORDER BY pa.fecha_pago DESC`,
      [userId]
    )
    
    // Obtener examenes del usuario (si tienes tabla de examenes)
    const [examenes] = await db.query(
      `SELECT e.*, p.nombre as paciente_nombre 
       FROM examenes e 
       JOIN pacientes p ON e.id_paciente = p.id_paciente 
       WHERE p.id_usuario = ? 
       ORDER BY e.fecha_examen DESC`,
      [userId]
    )
    
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
    const [pacientes] = await db.query(
      'SELECT * FROM pacientes WHERE id_usuario = ? ORDER BY nombre',
      [userId]
    )
    res.json(pacientes)
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
    
    const [result] = await db.query(
      'INSERT INTO pacientes (id_usuario, nombre, especie, raza, edad, peso) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, nombre, especie, raza, edad, peso]
    )
    
    res.status(201).json({ 
      message: 'Mascota registrada exitosamente',
      id: result.insertId 
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
    
    // Verificar que la mascota pertenece al usuario
    const [existingPet] = await db.query(
      'SELECT id_paciente FROM pacientes WHERE id_paciente = ? AND id_usuario = ?',
      [petId, userId]
    )
    
    if (!existingPet || existingPet.length === 0) {
      return res.status(404).json({ message: 'Mascota no encontrada' })
    }
    
    // Eliminar la mascota
    await db.query('DELETE FROM pacientes WHERE id_paciente = ?', [petId])
    
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
    const [citas] = await db.query(
      `SELECT c.*, p.nombre as paciente_nombre, s.nombre as servicio_nombre, s.precio 
       FROM citas c 
       JOIN pacientes p ON c.id_paciente = p.id_paciente 
       JOIN servicios s ON c.id_servicio = s.id_servicio 
       WHERE c.id_usuario = ? 
       ORDER BY c.fecha_cita DESC`,
      [userId]
    )
    
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
    
    const [result] = await db.query(
      'INSERT INTO citas (id_usuario, id_paciente, id_servicio, fecha_cita, estado) VALUES (?, ?, ?, ?, ?)',
      [userId, id_paciente, id_servicio, fecha_cita, 'pendiente']
    )
    
    res.status(201).json({ 
      message: 'Cita agendada exitosamente',
      id: result.insertId 
    })
  } catch (error) {
    console.error('Error al agendar cita:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Obtener servicios disponibles
router.get('/servicios', authUser, authCliente, async (req, res) => {
  try {
    const [servicios] = await db.query(
      'SELECT * FROM servicios ORDER BY nombre'
    )
    
    // Formatear precios para el cliente (con separador de miles)
    const serviciosFormateados = servicios.map((servicio: any) => ({
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
    const [pagos] = await db.query(
      `SELECT pa.*, s.nombre as servicio_nombre, c.fecha_cita 
       FROM pagos pa 
       JOIN citas c ON pa.id_cita = c.id_cita 
       JOIN servicios s ON c.id_servicio = s.id_servicio 
       WHERE c.id_usuario = ? 
       ORDER BY pa.fecha_pago DESC`,
      [userId]
    )
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
    const [examenes] = await db.query(
      `SELECT e.*, p.nombre as paciente_nombre 
       FROM examenes e 
       JOIN pacientes p ON e.id_paciente = p.id_paciente 
       WHERE p.id_usuario = ? 
       ORDER BY e.fecha_examen DESC`,
      [userId]
    )
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
    
    // Verificar que la mascota pertenece al usuario
    const [existingPet] = await db.query(
      'SELECT id_paciente FROM pacientes WHERE id_paciente = ? AND id_usuario = ?',
      [id_paciente, userId]
    )
    
    if (!existingPet || existingPet.length === 0) {
      return res.status(403).json({ message: 'Mascota no encontrada' })
    }
    
    const [result] = await db.query(
      'INSERT INTO examenes (id_paciente, tipo_examen, fecha_examen, observaciones, estado) VALUES (?, ?, NOW(), ?, ?)',
      [id_paciente, tipo_examen, observaciones || '', 'pendiente']
    )
    
    res.status(201).json({ 
      message: 'Examen solicitado exitosamente',
      id: result.insertId 
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
    const [usuarios] = await db.query(
      'SELECT id_usuario, nombre, apellido, email, telefono, direccion FROM usuarios WHERE id_usuario = ?',
      [userId]
    )
    
    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }
    
    res.json(usuarios[0])
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
    
    await db.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, direccion = ? WHERE id_usuario = ?',
      [nombre, apellido, telefono, direccion, userId]
    )
    
    res.json({ message: 'Perfil actualizado exitosamente' })
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

export default router
