import { Router } from 'express'
import { RegisterController } from '../../controllers/auth/register.controller'
import { validateRegister } from '../../middlewares/auth/register.middleware'

const router = Router()

router.post('/', validateRegister, RegisterController.register)

export default router
