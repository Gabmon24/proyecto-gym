import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env.js';
import * as schema from './schema.js';

// Cliente de conexión PostgreSQL con connection pooling
const queryClient = postgres(env.DATABASE_URL, {
  max: env.NODE_ENV === 'production' ? 10 : 1,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: env.NODE_ENV === 'production' ? 'require' : undefined,
});

export const db = drizzle(queryClient, { schema });
