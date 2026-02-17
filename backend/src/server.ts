import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

// =========================
// Health
// =========================
app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

/* =========================
   AUTH (dominios)
========================= */
import registerRouter from './routes/auth/register.routes'
import loginRouter from './routes/auth/login.routes'

app.use('/auth/register', registerRouter)
app.use('/auth/login', loginRouter)

/* =========================
   ADMIN (dominios separados)
========================= */
import adminUsuariosRouter from './routes/admin/usuarios.routes'
import adminPacientesRouter from './routes/admin/pacientes.routes'
import adminCitasRouter from './routes/admin/citas.routes'
import adminExamenesRouter from './routes/admin/examenes.routes'
import adminServiciosRouter from './routes/admin/servicios.routes'
import adminPagosRouter from './routes/admin/pagos.routes'

app.use('/admin/usuarios', adminUsuariosRouter)
app.use('/admin/pacientes', adminPacientesRouter)
app.use('/admin/citas', adminCitasRouter)
app.use('/admin/examenes', adminExamenesRouter)
app.use('/admin/servicios', adminServiciosRouter)
app.use('/admin/pagos', adminPagosRouter)

/* =========================
   CLIENT (dominios separados)
========================= */
import dashboardRouter from './routes/client/dashboard.routes'
import perfilRouter from './routes/client/perfil.routes'
import mascotasRouter from './routes/client/mascotas.routes'
import citasRouter from './routes/client/citas.routes'
import serviciosRouter from './routes/client/servicios.routes'
import examenesRouter from './routes/client/examenes.routes'

app.use('/client/dashboard', dashboardRouter)
app.use('/client/perfil', perfilRouter)
app.use('/client/mascotas', mascotasRouter)
app.use('/client/citas', citasRouter)
app.use('/client/servicios', serviciosRouter)
app.use('/client/examenes', examenesRouter)

/* =========================
   Error handler global
========================= */
app.use((error: any, _req: any, res: any, _next: any) => {
  console.error('Error no manejado:', error)
  res.status(500).json({
    message: 'Error interno del servidor',
    error:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Error interno',
  })
})

/* =========================
   404
========================= */
app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`🚀 API running on http://localhost:${port}`)
})
