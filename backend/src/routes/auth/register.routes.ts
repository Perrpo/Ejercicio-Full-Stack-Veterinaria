import { Router } from 'express'
import { RegisterController } from '../../controllers/auth/register.controller'
import { validateRegister } from '../../middlewares/auth/register.middleware'

const router = Router()

router.post('/register', validateRegister, RegisterController.register)

export default router
