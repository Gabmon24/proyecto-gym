import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerida para conectar con PostgreSQL'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres para ser criptográficamente seguro'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

// Validación en tiempo de arranque (fail-fast)
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Error de configuración: Variables de entorno inválidas o faltantes:');
  console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
  // En modo test no detenemos la ejecución forzada para permitir tests unitarios puros
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  }
}

export const env = parsedEnv.success
  ? parsedEnv.data
  : {
      NODE_ENV: 'test' as const,
      PORT: 3000,
      DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/gym_db',
      JWT_SECRET: 'test_jwt_secret_that_is_32_characters_long_minimum',
      FRONTEND_URL: 'http://localhost:5173',
    };
