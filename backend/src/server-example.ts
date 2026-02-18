import express from 'express';
import config from './config/environment';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (config.cors.origin.includes(origin || '')) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Routes
import { clientRoutes } from './routes/client.routes';
import { adminRoutes } from './routes/admin.routes';
import { authRoutes } from './routes/auth.routes';

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/admin', adminRoutes);

// Nueva ruta de ejemplo con SOLID
import { CitaController } from './presentation/controllers/CitaController';
import { CitaService } from './application/services/CitaService';
import { CitaRepository } from './infrastructure/repositories/CitaRepository';
import { MascotaRepository } from './infrastructure/repositories/MascotaRepository';
import { supabaseForUser } from './supabase';

app.post('/api/v2/citas', async (req, res) => {
  try {
    const jwt = req.headers.authorization?.split(' ')[1];
    if (!jwt) return res.status(401).json({ error: 'No autorizado' });

    const supabase = supabaseForUser(jwt);
    const citaRepo = new CitaRepository(supabase);
    const mascotaRepo = new MascotaRepository(supabase);

    const citaService = new CitaService(citaRepo, mascotaRepo);
    const controller = new CitaController(citaService, null); // gestorTransicion aquí

    await controller.crear(req, res);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: config.nodeEnv === 'production' ? 'Error interno del servidor' : err.message,
  });
});

// Start server
const PORT = config.port;
const HOST = config.host;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║       🐾 Clínica Veterinaria - API SOLID        ║
╠══════════════════════════════════════════════════╣
║ Environment:  ${config.nodeEnv.padEnd(40)}║
║ Host:         ${HOST}:${PORT.toString().padEnd(36)}║
║ Supabase:     ${config.supabase.url.substring(0, 40).padEnd(40)}║
╚══════════════════════════════════════════════════╝

📍 Endpoints:
   - Health: http://${HOST}:${PORT}/health
   - Auth:   http://${HOST}:${PORT}/api/auth
   - Client: http://${HOST}:${PORT}/api/client
   - Admin:  http://${HOST}:${PORT}/api/admin
   - Citas SOLID: http://${HOST}:${PORT}/api/v2/citas

🔐 Documentación: Ver CONFIGURACION_ENV.md
  `);
});

export default app;
