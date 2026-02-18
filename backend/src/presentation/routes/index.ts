/**
 * PRESENTATION LAYER - Routes Index
 * Consolidador de todas las rutas
 */

import { Router } from 'express'
import citaRoutes from './cita.routes'
import pagoRoutes from './pago.routes'
import clienteRoutes from './cliente.routes'
import mascotaRoutes from './mascota.routes'

const router = Router()

// Montar rutas
router.use('/citas', citaRoutes)
router.use('/pagos', pagoRoutes)
router.use('/clientes', clienteRoutes)
router.use('/mascotas', mascotaRoutes)

export default router
