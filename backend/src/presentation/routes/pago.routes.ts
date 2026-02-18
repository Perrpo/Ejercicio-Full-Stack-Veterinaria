/**
 * PRESENTATION LAYER - Pago Routes
 * Rutas HTTP para gestión de Pagos
 */

import { Router } from 'express'
import { PagoController } from '../controllers'

const router = Router()
const pagoController = new PagoController()

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Crear un nuevo pago
 *     tags: [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePagoDTO'
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', (req, res) => pagoController.crearPago(req, res))

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 */
router.get('/', (req, res) => pagoController.obtenerTodosPagos(req, res))

/**
 * @swagger
 * /api/pagos/{id}:
 *   get:
 *     summary: Obtener un pago específico
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Detalles del pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago no encontrado
 */
router.get('/:id', (req, res) => pagoController.obtenerPago(req, res))

/**
 * @swagger
 * /api/pagos/cita/{citaId}:
 *   get:
 *     summary: Obtener pagos de una cita específica
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: citaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Lista de pagos de la cita
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 */
router.get('/cita/:citaId', (req, res) => pagoController.obtenerPagosCita(req, res))

/**
 * @swagger
 * /api/pagos/{id}:
 *   put:
 *     summary: Actualizar un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monto:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Pago actualizado
 */
router.put('/:id', (req, res) => pagoController.actualizarPago(req, res))

/**
 * @swagger
 * /api/pagos/{id}/confirmar:
 *   put:
 *     summary: Confirmar un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago confirmado
 */
router.put('/:id/confirmar', (req, res) => pagoController.confirmarPago(req, res))

/**
 * @swagger
 * /api/pagos/{id}/rechazar:
 *   put:
 *     summary: Rechazar un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago rechazado
 */
router.put('/:id/rechazar', (req, res) => pagoController.rechazarPago(req, res))

/**
 * @swagger
 * /api/pagos/{id}:
 *   delete:
 *     summary: Eliminar un pago
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pago eliminado exitosamente
 */
router.delete('/:id', (req, res) => pagoController.eliminarPago(req, res))

export default router
