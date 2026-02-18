import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Configuración centralizada de variables de entorno
 * Asegura que todas las variables necesarias están definidas
 */

interface Config {
  // Server
  nodeEnv: 'development' | 'staging' | 'production';
  port: number;
  host: string;

  // Supabase
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };

  // Database
  database: {
    url: string;
  };

  // JWT
  jwt: {
    secret: string;
    expiresIn: string;
  };

  // CORS
  cors: {
    origin: string[];
  };

  // Logging
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
  };
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Variable de entorno ${key} no está definida`);
  }

  return value;
}

const config: Config = {
  // Server
  nodeEnv: (process.env.NODE_ENV as any) || 'development',
  port: parseInt(getEnv('PORT', '3000'), 10),
  host: getEnv('HOST', 'localhost'),

  // Supabase
  supabase: {
    url: getEnv('SUPABASE_URL'),
    anonKey: getEnv('SUPABASE_ANON_KEY'),
    serviceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  },

  // Database
  database: {
    url: getEnv('DATABASE_URL', 'postgresql://localhost/veterinaria'),
  },

  // JWT
  jwt: {
    secret: getEnv('JWT_SECRET', 'dev-secret-key'),
    expiresIn: getEnv('JWT_EXPIRES_IN', '7d'),
  },

  // CORS
  cors: {
    origin: getEnv('CORS_ORIGIN', 'http://localhost:3000')
      .split(',')
      .map((url) => url.trim()),
  },

  // Logging
  logging: {
    level: (getEnv('LOG_LEVEL', 'info') as any) || 'info',
  },
};

// Validar que estamos en producción con valores seguros
if (config.nodeEnv === 'production') {
  if (config.jwt.secret === 'dev-secret-key') {
    throw new Error(
      'ERROR: JWT_SECRET debe ser distinto en producción. Usa un valor seguro generado.'
    );
  }
  if (config.supabase.url.includes('localhost')) {
    throw new Error('ERROR: SUPABASE_URL no debe apuntar a localhost en producción');
  }
}

export default config;
