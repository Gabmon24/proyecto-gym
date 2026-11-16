import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createMemberSchema, updateMemberSchema } from '../schemas/member.schema.js';
import { MemberRepository } from '../repositories/member.repository.js';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { MembershipService } from '../services/membership.service.js';

export const memberRoutes = new Hono();

// 1. Registrar un nuevo miembro
memberRoutes.post('/', zValidator('json', createMemberSchema), async (c) => {
  const data = c.req.valid('json');

  // Verificar si la cédula ya existe
  const existing = await MemberRepository.findByDocument(data.documentNumber);
  if (existing) {
    return c.json({
      success: false,
      error: `Ya existe un miembro registrado con el número de documento ${data.documentNumber}.`
    }, 409);
  }

  const member = await MemberRepository.create(data);
  return c.json({ success: true, data: member }, 201);
});

// 2. Listar miembros
memberRoutes.get('/', async (c) => {
  const limit = Math.min(Number(c.req.query('limit')) || 50, 100);
  const offset = Number(c.req.query('offset')) || 0;

  const list = await MemberRepository.findAll(limit, offset);
  return c.json({ success: true, data: list, count: list.length });
});

// 3. Consultar miembro por Cédula (con estado de suscripción)
memberRoutes.get('/by-document/:documentNumber', async (c) => {
  const doc = c.req.param('documentNumber');
  const member = await MemberRepository.findByDocument(doc);

  if (!member) {
    return c.json({ success: false, error: 'Miembro no encontrado' }, 404);
  }

  // Obtener su última membresía
  const latestSub = await SubscriptionRepository.findLatestByMemberId(member.id);
  let subscriptionStatus = null;

  if (latestSub) {
    const statusInfo = MembershipService.getSubscriptionStatus(new Date(latestSub.subscription.endDate));
    subscriptionStatus = {
      ...statusInfo,
      planName: latestSub.plan.name,
      startDate: latestSub.subscription.startDate,
      endDate: latestSub.subscription.endDate,
      formattedAmount: MembershipService.formatCOP(latestSub.subscription.amountPaidCOP),
    };
  }

  return c.json({
    success: true,
    data: {
      member,
      subscription: subscriptionStatus
    }
  });
});
