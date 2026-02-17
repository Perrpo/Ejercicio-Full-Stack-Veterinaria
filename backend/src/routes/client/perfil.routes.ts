import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authCliente } from '../../middlewares/client.middleware'
import { PerfilController } from '../../controllers/client/perfil.controller'

const router = Router()

router.get('/', authUser, authCliente, PerfilController.getProfile)
router.put('/', authUser, authCliente, PerfilController.updateProfile)

export default router
