import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', async (_req, res) => {
  res.json({ ok: true })
})

// Rutas

//admin
import adminRouter from './routes/admin.routes'
app.use('/admin', adminRouter)


/* =========================
   AUTH (dominios)
========================= */
import registerRouter from './routes/auth/register.routes'
import loginRouter from './routes/auth/login.routes'

app.use('/auth/register', registerRouter)
app.use('/auth/login', loginRouter)

// Routers de dominios client
import dashboardRouter from './routes/client/dashboard.routes'
import perfilRouter from './routes/client/perfil.routes'
import mascotasRouter from './routes/client/mascotas.routes'
import citasRouter from './routes/client/citas.routes'
import serviciosRouter from './routes/client/servicios.routes'
import examenesRouter from './routes/client/examenes.routes'

// Ahora cada dominio tiene su propio prefijo si quieres
app.use('/client/dashboard', dashboardRouter)
app.use('/client/perfil', perfilRouter)
app.use('/client/mascotas', mascotasRouter)
app.use('/client/citas', citasRouter)
app.use('/client/servicios', serviciosRouter)
app.use('/client/examenes', examenesRouter)

// Middleware de manejo de errores global
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Error no manejado:', error)
  res.status(500).json({ 
    message: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  })
})

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`)
})
