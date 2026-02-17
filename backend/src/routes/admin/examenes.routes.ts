import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authAdmin } from '../../middlewares/admin.middleware'
import { ExamenesAdminController } from '../../controllers/admin/examenes.controller'

const router = Router()

router.get('/', authUser, authAdmin, ExamenesAdminController.getExamenes)
router.post('/', authUser, authAdmin, ExamenesAdminController.createExamen)
router.put('/:id', authUser, authAdmin, ExamenesAdminController.updateExamen)
router.delete('/:id', authUser, authAdmin, ExamenesAdminController.deleteExamen)

export default router
