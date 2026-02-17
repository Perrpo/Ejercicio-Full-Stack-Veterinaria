import { Router } from 'express'
import { authUser } from '../../middlewares/auth.middleware'
import { authAdmin } from '../../middlewares/admin.middleware'
import { UsuariosAdminController } from '../../controllers/admin/usuarios.controller'

const router = Router()

router.get('/', authUser, authAdmin, UsuariosAdminController.getUsuarios)
router.post('/', authUser, authAdmin, UsuariosAdminController.createUsuario)
router.put('/:id', authUser, authAdmin, UsuariosAdminController.updateUsuario)
router.delete('/:id', authUser, authAdmin, UsuariosAdminController.deleteUsuario)

export default router
