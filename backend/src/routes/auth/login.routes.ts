import { Router } from 'express'
import { LoginController } from '../../controllers/auth/login.controller'
import { validateLogin } from '../../middlewares/auth/login.middleware'

const router = Router()

router.post('/login', validateLogin, LoginController.login)

export default router
