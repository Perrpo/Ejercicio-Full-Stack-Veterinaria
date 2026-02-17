import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authAdmin } from '../../middlewares/admin.middleware'
import { CitasAdminController } from '../../controllers/admin/citas.controller'

const router = Router()

router.get('/', authUser, authAdmin, CitasAdminController.getCitas)
router.post('/', authUser, authAdmin, CitasAdminController.createCita)
router.put('/:id', authUser, authAdmin, CitasAdminController.updateCita)
router.delete('/:id', authUser, authAdmin, CitasAdminController.deleteCita)

export default router
