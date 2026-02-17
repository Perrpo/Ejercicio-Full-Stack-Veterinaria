import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authCliente } from '../../middlewares/client.middleware'
import { PerfilController } from '../../controllers/client/perfil.controller'

const router = Router()

router.get('/perfil', authUser, authCliente, PerfilController.getProfile)
router.put('/perfil', authUser, authCliente, PerfilController.updateProfile)

export default router
