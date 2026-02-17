import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authCliente } from '../../middlewares/client.middleware'
import { CitasController } from '../../controllers/client/citas.controller'

const router = Router()

router.get('/', authUser, authCliente, CitasController.getCitas)
router.post('/', authUser, authCliente, CitasController.createCita)

export default router
