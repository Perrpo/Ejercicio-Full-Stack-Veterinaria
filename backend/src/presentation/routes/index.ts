/**
 * PRESENTATION LAYER - Routes Index
 * Consolidador de todas las rutas
 */

import { Router } from 'express'
import citaRoutes from './cita.routes'
import pagoRoutes from './pago.routes'

const router = Router()

// Montar rutas
router.use('/citas', citaRoutes)
router.use('/pagos', pagoRoutes)

export default router
