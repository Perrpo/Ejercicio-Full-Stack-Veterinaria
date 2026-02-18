import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', async (_req, res) => {
  res.json({ ok: true })
})

import authRouter from './routes/auth.routes'
import adminRouter from './routes/admin.routes'
import clientRouter from './routes/client.routes'

app.use('/auth', authRouter)
app.use('/admin', adminRouter)
app.use('/client', clientRouter)

// Middleware de manejo de errores global
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error no manejado:', error)
  res.status(500).json({ 
    message: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  })
})

// Middleware para rutas no encontradas (se ejecuta solo si ninguna ruta anterior coincide)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})
