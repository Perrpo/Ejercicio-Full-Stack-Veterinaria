import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authCliente } from '../../middlewares/client.middleware'
import { DashboardController } from '../../controllers/client/dashboard.controller'

const router = Router()

router.get('/dashboard', authUser, authCliente, DashboardController.getDashboard)

export default router
