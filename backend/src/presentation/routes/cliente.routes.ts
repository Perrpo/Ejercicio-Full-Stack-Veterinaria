/**
 * PRESENTATION LAYER - Cliente Routes
 * Rutas HTTP para gestión de Clientes
 */

import { Router } from 'express'

const router = Router()

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.get('/', (_req, res) => {
  res.json([
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@email.com',
      telefono: '+1234567890',
      direccion: 'Calle Principal #123'
    }
  ])
})

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClienteDTO'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Datos inválidos
 */
router.post('/', (req, res) => {
  res.status(201).json({
    id: 2,
    ...req.body
  })
})

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener un cliente específico
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Detalles del cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', (req, res) => {
  const { id } = req.params
  res.json({
    id: Number(id),
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@email.com'
  })
})

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 */
router.put('/:id', (req, res) => {
  const { id } = req.params
  res.json({
    id: Number(id),
    ...req.body
  })
})

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       204:
 *         description: Cliente eliminado exitosamente
 */
router.delete('/:id', (req, res) => {
  res.status(204).send()
})

export default router
