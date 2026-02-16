import { Router } from 'express'
import { authUser } from '../middlewares/auth.middleware'
import { authCliente } from '../middlewares/client.middleware'
import { ClientController } from '../controllers/client.controller'

const router = Router()

//darshboard
router.get('/dashboard', authUser, authCliente, ClientController.dashboard)

//perfil
router.get('/perfil', authUser, authCliente, ClientController.getProfile)
router.put('/perfil', authUser, authCliente, ClientController.updateProfile)

//mascotas
router.get('/mascotas', authUser, authCliente, ClientController.getMascotas)
router.post('/mascotas', authUser, authCliente, ClientController.createMascota)
router.delete('/mascotas/:id', authUser, authCliente, ClientController.deleteMascota)

// citas
router.get('/citas', authUser, authCliente, ClientController.getCitas)
router.post('/citas', authUser, authCliente, ClientController.createCita)

// servicios
router.get('/servicios', authUser, authCliente, ClientController.getServicios)

// examenes
router.get('/examenes', authUser, authCliente, ClientController.getExamenes)
router.post('/examenes', authUser, authCliente, ClientController.createExamen)


export default router
