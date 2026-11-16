import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createSubscriptionSchema } from '../schemas/subscription.schema.js';
import { PlanRepository } from '../repositories/plan.repository.js';
import { MemberRepository } from '../repositories/member.repository.js';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { MembershipService } from '../services/membership.service.js';

export const subscriptionRoutes = new Hono();

// Registrar o renovar una suscripción para un miembro
subscriptionRoutes.post('/', zValidator('json', createSubscriptionSchema), async (c) => {
  const data = c.req.valid('json');

  // 1. Validar que el miembro existe
  const member = await MemberRepository.findById(data.memberId);
  if (!member) {
    return c.json({ success: false, error: 'El miembro especificado no existe' }, 404);
  }

  // 2. Validar que el plan existe
  const plan = await PlanRepository.findById(data.planId);
  if (!plan) {
    return c.json({ success: false, error: 'El plan especificado no existe' }, 404);
  }

  // 3. Calcular fecha de vencimiento usando el motor de dominio
  const start = new Date(data.startDate);
  const end = MembershipService.calculateExpirationDate(start, plan.durationMonths, {
    bonusDays: data.graceDays,
    compensateHolidays: data.compensateHolidays,
  });

  const statusInfo = MembershipService.getSubscriptionStatus(end, start);

  // 4. Guardar en base de datos
  const subscription = await SubscriptionRepository.create({
    memberId: data.memberId,
    planId: data.planId,
    startDate: start,
    endDate: end,
    graceDays: data.graceDays,
    status: statusInfo.status,
    paymentMethod: data.paymentMethod,
    amountPaidCOP: data.amountPaidCOP,
    notes: data.notes || null,
  });

  return c.json({
    success: true,
    data: {
      subscription,
      summary: {
        planName: plan.name,
        formattedPaid: MembershipService.formatCOP(data.amountPaidCOP),
        daysGranted: statusInfo.daysRemaining,
        endDate: end.toISOString(),
      }
    }
  }, 201);
});
