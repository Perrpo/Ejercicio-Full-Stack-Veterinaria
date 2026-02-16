import { Router } from 'express'
import { authUser } from '../middlewares/auth.middleware'
import { authAdmin } from '../middlewares/admin.middleware'
import { AdminController } from '../controllers/admin.controller'

const router = Router()

router.get('/usuarios', authUser, authAdmin, AdminController.getUsuarios)
router.post('/usuarios', authUser, authAdmin, AdminController.createUsuario)

export default router
