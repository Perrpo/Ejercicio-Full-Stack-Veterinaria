/**
 * PRESENTATION LAYER - Mascota Routes
 * Rutas HTTP para gestión de Mascotas
 */

import { Router } from 'express'
import { MascotaController } from '../controllers'

const router = Router()
const mascotaController = new MascotaController()

/**
 * @swagger
 * /api/mascotas:
 *   get:
 *     summary: Obtener todas las mascotas
 *     tags: [Mascotas]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 */
router.get('/', (req, res) => mascotaController.obtenerTodasMascotas(req, res))

/**
 * @swagger
 * /api/mascotas:
 *   post:
 *     summary: Crear una nueva mascota
 *     tags: [Mascotas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMascotaDTO'
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', (req, res) => mascotaController.crearMascota(req, res))

/**
 * @swagger
 * /api/mascotas/{id}:
 *   get:
 *     summary: Obtener una mascota específica
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Detalles de la mascota
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mascota'
 *       404:
 *         description: Mascota no encontrada
 */
router.get('/:id', (req, res) => mascotaController.obtenerMascota(req, res))

/**
 * @swagger
 * /api/mascotas/cliente/{clienteId}:
 *   get:
 *     summary: Obtener mascotas de un cliente específico
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de mascotas del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mascota'
 */
router.get('/cliente/:clienteId', (req, res) => mascotaController.obtenerMascotasCliente(req, res))

/**
 * @swagger
 * /api/mascotas/{id}:
 *   put:
 *     summary: Actualizar una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               especie:
 *                 type: string
 *               raza:
 *                 type: string
 *               edad:
 *                 type: integer
 *               peso:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Mascota actualizada
 */
router.put('/:id', (req, res) => mascotaController.actualizarMascota(req, res))

/**
 * @swagger
 * /api/mascotas/{id}:
 *   delete:
 *     summary: Eliminar una mascota
 *     tags: [Mascotas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la mascota
 *     responses:
 *       204:
 *         description: Mascota eliminada exitosamente
 */
router.delete('/:id', (req, res) => mascotaController.eliminarMascota(req, res))

export default router
