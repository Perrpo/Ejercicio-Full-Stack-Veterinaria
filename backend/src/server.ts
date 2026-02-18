import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './swagger.config'

const app = express()

// =========================
// Middlewares globales
// =========================
app.use(cors())
app.use(express.json())

// =========================
// Swagger Documentation
// =========================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Veterinaria - Docs'
}))

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar el estado del servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: El servidor está funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */
app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

/* =========================
   RUTAS - Arquitectura por Capas
========================= */
import layeredRoutes from './presentation/routes'

app.use('/api', layeredRoutes)

/* =========================
   Error handling
========================= */
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`🚀 API running on http://localhost:${port}`)
})
