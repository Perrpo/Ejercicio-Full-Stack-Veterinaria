import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authAdmin } from '../../middlewares/admin.middleware'
import { PagosAdminController } from '../../controllers/admin/pagos.controller'

const router = Router()

router.get('/', authUser, authAdmin, PagosAdminController.getPagos)
router.post('/', authUser, authAdmin, PagosAdminController.createPago)
router.delete('/:id', authUser, authAdmin, PagosAdminController.deletePago)

export default router
