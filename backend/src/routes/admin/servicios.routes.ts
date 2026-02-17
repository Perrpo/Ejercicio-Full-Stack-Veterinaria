import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authAdmin } from '../../middlewares/admin.middleware'
import { ServiciosAdminController } from '../../controllers/admin/servicios.controller'

const router = Router()

router.get('/', authUser, authAdmin, ServiciosAdminController.getServicios)
router.post('/', authUser, authAdmin, ServiciosAdminController.createServicio)
router.put('/:id', authUser, authAdmin, ServiciosAdminController.updateServicio)
router.delete('/:id', authUser, authAdmin, ServiciosAdminController.deleteServicio)

export default router
