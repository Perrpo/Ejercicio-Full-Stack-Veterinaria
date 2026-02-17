import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authCliente } from '../../middlewares/client.middleware'
import { ServiciosController } from '../../controllers/client/servicios.controller'

const router = Router()

router.get('/', authUser, authCliente, ServiciosController.getServicios)

export default router
