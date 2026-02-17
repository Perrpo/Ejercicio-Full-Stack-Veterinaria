import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authCliente } from '../../middlewares/client.middleware'
import { ExamenesController } from '../../controllers/client/examenes.controller'

const router = Router()

router.get('/examenes', authUser, authCliente, ExamenesController.getExamenes)
router.post('/examenes', authUser, authCliente, ExamenesController.createExamen)

export default router
