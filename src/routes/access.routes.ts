import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { checkInSchema } from '../schemas/access.schema.js';
import { MemberRepository } from '../repositories/member.repository.js';
import { SubscriptionRepository } from '../repositories/subscription.repository.js';
import { AccessRepository } from '../repositories/access.repository.js';
import { MembershipService } from '../services/membership.service.js';

export const accessRoutes = new Hono();

// Check-in rápido en recepción por número de cédula/documento
accessRoutes.post('/check-in', zValidator('json', checkInSchema), async (c) => {
  const { documentNumber } = c.req.valid('json');

  // 1. Buscar miembro por cédula
  const member = await MemberRepository.findByDocument(documentNumber);
  if (!member) {
    return c.json({
      success: false,
      allowed: false,
      result: 'denied_inactive',
      message: `No se encontró ningún miembro registrado con el documento ${documentNumber}.`
    }, 404);
  }

  const memberFullName = `${member.firstName} ${member.lastName}`;

  // 2. Buscar su última membresía
  const latestSub = await SubscriptionRepository.findLatestByMemberId(member.id);

  if (!latestSub) {
    const deniedMessage = `Acceso DENEGADO para ${memberFullName}. No registra ninguna membresía en el sistema.`;
    await AccessRepository.log({
      memberId: member.id,
      subscriptionId: null,
      accessResult: 'denied_expired',
      message: deniedMessage,
    });

    return c.json({
      success: true,
      allowed: false,
      result: 'denied_expired',
      message: deniedMessage,
      member: {
        id: member.id,
        name: memberFullName,
        documentNumber: member.documentNumber,
      }
    });
  }

  // 3. Evaluar estado dinámico de la suscripción
  const statusInfo = MembershipService.getSubscriptionStatus(new Date(latestSub.subscription.endDate));
  const evaluation = MembershipService.evaluateAccess(member.status, statusInfo, memberFullName);

  // 4. Guardar log en base de datos
  await AccessRepository.log({
    memberId: member.id,
    subscriptionId: latestSub.subscription.id,
    accessResult: evaluation.result,
    message: evaluation.message,
  });

  return c.json({
    success: true,
    allowed: evaluation.allowed,
    result: evaluation.result,
    message: evaluation.message,
    member: {
      id: member.id,
      name: memberFullName,
      documentNumber: member.documentNumber,
      planName: latestSub.plan.name,
      daysRemaining: statusInfo.daysRemaining,
      expirationDate: latestSub.subscription.endDate,
    }
  });
});

// Historial de entradas recientes (para el monitor en vivo de recepción)
accessRoutes.get('/recent', async (c) => {
  const limit = Math.min(Number(c.req.query('limit')) || 25, 50);
  const logs = await AccessRepository.findRecent(limit);
  return c.json({ success: true, data: logs });
});
