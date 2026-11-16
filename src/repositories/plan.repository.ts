import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { plans } from '../db/schema.js';

export class PlanRepository {
  /**
   * Obtiene todos los planes activos disponibles para compra
   */
  public static async findAllActive() {
    return await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true));
  }

  /**
   * Busca un plan por su ID
   */
  public static async findById(id: string) {
    const result = await db
      .select()
      .from(plans)
      .where(eq(plans.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Inserta un plan en la base de datos
   */
  public static async create(data: {
    name: string;
    priceCOP: number;
    durationMonths: number;
    durationDays: number;
    description?: string;
  }) {
    const result = await db
      .insert(plans)
      .values(data)
      .returning();

    return result[0]!;
  }
}
