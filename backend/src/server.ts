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

import authRouter from './routes/auth'
import adminRouter from './routes/admin'

app.use('/auth', authRouter)
app.use('/admin', adminRouter)

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})
