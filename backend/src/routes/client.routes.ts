import { Router } from 'express'
import { authUser } from '../middlewares/auth.middleware'
import { authCliente } from '../middlewares/client.middleware'
import { ClientController } from '../controllers/client.controller'

const router = Router()

router.get('/dashboard', authUser, authCliente, ClientController.dashboard)
router.post('/mascotas', authUser, authCliente, ClientController.createMascota)
router.get(
  '/perfil',
  authUser,
  authCliente,
  ClientController.getProfile
)

router.put(
  '/perfil',
  authUser,
  authCliente,
  ClientController.updateProfile
)



export default router
