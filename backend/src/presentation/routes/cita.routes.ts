/**
 * PRESENTATION LAYER - Cita Routes
 * Rutas HTTP para gestión de Citas
 */

import { Router } from 'express'
import { CitaController } from '../controllers'

const router = Router()
const citaController = new CitaController()

/**
 * @swagger
 * /api/citas:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [Citas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCitaDTO'
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res) => citaController.crearCita(req, res))

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Obtener todas las citas
 *     tags: [Citas]
 *     responses:
 *       200:
 *         description: Lista de citas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cita'
 */
router.get('/', (req, res) => citaController.obtenerTodasCitas(req, res))

/**
 * @swagger
 * /api/citas/{id}:
 *   get:
 *     summary: Obtener una cita específica
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Detalles de la cita
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 *       404:
 *         description: Cita no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res) => citaController.obtenerCita(req, res))

/**
 * @swagger
 * /api/citas/{id}:
 *   put:
 *     summary: Actualizar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_cita:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Cita actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cita'
 */
router.put('/:id', (req, res) => citaController.actualizarCita(req, res))

/**
 * @swagger
 * /api/citas/{id}/confirmar:
 *   put:
 *     summary: Confirmar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cita confirmada
 */
router.put('/:id/confirmar', (req, res) => citaController.confirmarCita(req, res))

/**
 * @swagger
 * /api/citas/{id}/cancelar:
 *   put:
 *     summary: Cancelar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cita cancelada
 */
router.put('/:id/cancelar', (req, res) => citaController.cancelarCita(req, res))

/**
 * @swagger
 * /api/citas/{id}/finalizar:
 *   put:
 *     summary: Finalizar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cita finalizada
 */
router.put('/:id/finalizar', (req, res) => citaController.finalizarCita(req, res))

/**
 * @swagger
 * /api/citas/{id}:
 *   delete:
 *     summary: Eliminar una cita
 *     tags: [Citas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cita eliminada exitosamente
 */
router.delete('/:id', (req, res) => citaController.eliminarCita(req, res))

export default router
