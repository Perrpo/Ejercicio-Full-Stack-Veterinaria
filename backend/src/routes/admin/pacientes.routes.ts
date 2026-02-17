import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authAdmin } from '../../middlewares/admin.middleware'
import { PacientesAdminController } from '../../controllers/admin/pacientes.controller'

const router = Router()

router.get('/', authUser, authAdmin, PacientesAdminController.getPacientes)
router.post('/', authUser, authAdmin, PacientesAdminController.createPaciente)
router.put('/:id', authUser, authAdmin, PacientesAdminController.updatePaciente)
router.delete('/:id', authUser, authAdmin, PacientesAdminController.deletePaciente)

export default router
