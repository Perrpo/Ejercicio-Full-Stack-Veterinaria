import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createPool } from 'mysql2/promise'

dotenv.config()

export const db = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vetcare',
  port: Number(process.env.DB_PORT || 3306),
  connectionLimit: 10,
})

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1')
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

// Endpoint de prueba para la base de datos
app.get('/test-db', async (_req, res) => {
  try {
    // Probar conexión básica
    const [result] = await db.query('SELECT 1 as test')
    
    // Verificar que la tabla pagos existe
    const [tables] = await db.query('SHOW TABLES LIKE "pagos"')
    
    // Verificar que hay citas disponibles
    const [citas] = await db.query('SELECT COUNT(*) as count FROM citas')
    
    res.json({ 
      ok: true, 
      db_connection: result, 
      pagos_table_exists: tables.length > 0,
      citas_count: citas[0].count
    })
  } catch (e) {
    console.error('Error en test-db:', e)
    res.status(500).json({ ok: false, error: e.message })
  }
})

import authRouter from './routes/auth'
import adminRouter from './routes/admin'
import clientRouter from './routes/client'

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
