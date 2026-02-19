/**
 * PRESENTATION LAYER - Routes Index
 * Consolidador de todas las rutas
 */

import { Router } from 'express'
import citaRoutes from './cita.routes'
import pagoRoutes from './pago.routes'
import clienteRoutes from './cliente.routes'
import mascotaRoutes from './mascota.routes'
import usuarioRoutes from './usuario.routes'
import authRoutes from '../../routes/auth'
import clientRoutes from '../../routes/client'
import adminRoutes from '../../routes/admin'

const router = Router()

// Montar rutas
router.use('/citas', citaRoutes)
router.use('/pagos', pagoRoutes)
router.use('/clientes', clienteRoutes)
router.use('/mascotas', mascotaRoutes)
router.use('/usuarios', usuarioRoutes)
router.use('/auth', authRoutes)
router.use('/client', clientRoutes)
router.use('/admin', adminRoutes)

export default router
