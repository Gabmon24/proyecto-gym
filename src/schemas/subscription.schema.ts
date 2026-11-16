import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  memberId: z.string().uuid('ID de miembro inválido (debe ser UUID)'),
  planId: z.string().uuid('ID de plan inválido (debe ser UUID)'),
  startDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .default(() => new Date().toISOString()),
  graceDays: z.number().int().min(0).default(0),
  compensateHolidays: z.boolean().default(false),
  paymentMethod: z.enum(['cash', 'nequi', 'daviplata', 'card', 'transfer']),
  amountPaidCOP: z.number().int().positive('El monto pagado debe ser mayor a 0'),
  notes: z.string().optional().nullable(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
