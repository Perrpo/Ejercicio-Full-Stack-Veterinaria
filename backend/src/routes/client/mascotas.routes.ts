import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authCliente } from '../../middlewares/client.middleware'
import { MascotasController } from '../../controllers/client/mascotas.controller'

const router = Router()

router.get('/mascotas', authUser, authCliente, MascotasController.getMascotas)
router.post('/mascotas', authUser, authCliente, MascotasController.createMascota)
router.delete('/mascotas/:id', authUser, authCliente, MascotasController.deleteMascota)

export default router
