import { Router } from 'express'
import { authUser } from '../middlewares/auth.middleware'
import { authAdmin } from '../middlewares/admin.middleware'
import { AdminController } from '../controllers/admin.controller'

const router = Router()

//usuarios
router.get('/usuarios', authUser, authAdmin, AdminController.getUsuarios)
router.post('/usuarios', authUser, authAdmin, AdminController.createUsuario)
router.put('/usuarios/:id', authUser, authAdmin, AdminController.updateUsuario)
router.delete('/usuarios/:id', authUser, authAdmin, AdminController.deleteUsuario)

// pacientes
router.get('/pacientes', authUser, authAdmin, AdminController.getPacientes)
router.post('/pacientes', authUser, authAdmin, AdminController.createPaciente)
router.put('/pacientes/:id', authUser, authAdmin, AdminController.updatePaciente)
router.delete('/pacientes/:id', authUser, authAdmin, AdminController.deletePaciente)

// citas
router.get('/citas', authUser, authAdmin, AdminController.getCitas)
router.post('/citas', authUser, authAdmin, AdminController.createCita)
router.put('/citas/:id', authUser, authAdmin, AdminController.updateCita)
router.delete('/citas/:id', authUser, authAdmin, AdminController.deleteCita)

// examenes
router.get('/examenes', authUser, authAdmin, AdminController.getExamenes)
router.post('/examenes', authUser, authAdmin, AdminController.createExamen)
router.put('/examenes/:id', authUser, authAdmin, AdminController.updateExamen)
router.delete('/examenes/:id', authUser, authAdmin, AdminController.deleteExamen)

//// servicios
router.get('/servicios', authUser, authAdmin, AdminController.getServicios)
router.post('/servicios', authUser, authAdmin, AdminController.createServicio)
router.put('/servicios/:id', authUser, authAdmin, AdminController.updateServicio)
router.delete('/servicios/:id', authUser, authAdmin, AdminController.deleteServicio)

// pagos
router.get('/pagos', authUser, authAdmin, AdminController.getPagos)
router.post('/pagos', authUser, authAdmin, AdminController.createPago)
router.put('/pagos/:id', authUser, authAdmin, AdminController.updatePago)
router.delete('/pagos/:id', authUser, authAdmin, AdminController.deletePago)

export default router
