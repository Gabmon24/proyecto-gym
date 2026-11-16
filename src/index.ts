import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { env } from './config/env.js';
import { memberRoutes } from './routes/member.routes.js';
import { subscriptionRoutes } from './routes/subscription.routes.js';
import { accessRoutes } from './routes/access.routes.js';
import { ColombianHolidaysService } from './services/colombian-holidays.service.js';
import { MembershipService } from './services/membership.service.js';

const app = new Hono();

// Middlewares globales
app.use('*', logger());
app.use('*', cors({
  origin: [env.FRONTEND_URL],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware de manejo de errores seguro (sin filtrar stack traces al cliente)
app.onError((err, c) => {
  const incidentId = crypto.randomUUID();
  console.error(`[Incident ID: ${incidentId}] Error no controlado:`, err);

  return c.json({
    success: false,
    error: {
      message: 'Ocurrió un error interno en el servidor.',
      incidentId,
    }
  }, 500);
});

// 1. Healthcheck
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    system: 'Proyecto Gym API (Core)',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    version: '1.0.0'
  });
});

// 2. Catálogo de Planes en Pesos Colombianos
app.get('/api/plans', (c) => {
  const defaultPlans = [
    {
      id: 'plan-mensual',
      name: 'Mensualidad Estándar',
      priceCOP: 60000,
      formattedPrice: MembershipService.formatCOP(60000),
      durationMonths: 1,
      durationDays: 30,
      description: 'Acceso ilimitado a máquinas y zona de pesas durante 1 mes calendario.',
    },
    {
      id: 'plan-trimestral',
      name: 'Plan Trimestral (Ahorro)',
      priceCOP: 160000,
      formattedPrice: MembershipService.formatCOP(160000),
      durationMonths: 3,
      durationDays: 90,
      description: '3 meses continuos. Ahorro de $20.000 COP sobre el valor mensual.',
    },
    {
      id: 'plan-pase-diario',
      name: 'Tiquera / Pase Diario',
      priceCOP: 10000,
      formattedPrice: MembershipService.formatCOP(10000),
      durationMonths: 0,
      durationDays: 1,
      description: 'Pase único válido para una sola sesión de entrenamiento.',
    }
  ];

  return c.json({ success: true, data: defaultPlans });
});

// 3. Consulta de Festivos Nacionales de Colombia (Ley Emiliani)
app.get('/api/holidays', (c) => {
  const year = Number(c.req.query('year')) || new Date().getFullYear();
  const holidays = ColombianHolidaysService.getHolidays(year);

  return c.json({
    success: true,
    year,
    totalHolidays: holidays.length,
    data: holidays
  });
});

// 4. Módulos de Rutas de la API (Modularidad y Buenas Prácticas)
app.route('/api/members', memberRoutes);
app.route('/api/subscriptions', subscriptionRoutes);
app.route('/api/access', accessRoutes);

// Iniciar servidor en el puerto configurado
const port = env.PORT;
console.log(`🏋️ Proyecto Gym API corriendo en http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;
