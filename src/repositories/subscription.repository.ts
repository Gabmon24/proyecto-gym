import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { subscriptions, plans } from '../db/schema.js';

export class SubscriptionRepository {
  /**
   * Crea una nueva suscripción asociada a un miembro y plan
   */
  public static async create(data: {
    memberId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    graceDays: number;
    status: 'active' | 'expiring_soon' | 'expired' | 'frozen';
    paymentMethod: 'cash' | 'nequi' | 'daviplata' | 'card' | 'transfer';
    amountPaidCOP: number;
    notes?: string | null;
  }) {
    const result = await db
      .insert(subscriptions)
      .values(data)
      .returning();

    return result[0]!;
  }

  /**
   * Obtiene la última suscripción registrada de un miembro con los datos del plan
   */
  public static async findLatestByMemberId(memberId: string) {
    const result = await db
      .select({
        subscription: subscriptions,
        plan: plans,
      })
      .from(subscriptions)
      .innerJoin(plans, eq(subscriptions.planId, plans.id))
      .where(eq(subscriptions.memberId, memberId))
      .orderBy(desc(subscriptions.endDate))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Actualiza el estado de una suscripción
   */
  public static async updateStatus(
    id: string,
    status: 'active' | 'expiring_soon' | 'expired' | 'frozen'
  ) {
    const result = await db
      .update(subscriptions)
      .set({ status, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();

    return result[0] || null;
  }
}
