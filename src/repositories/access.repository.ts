import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { accessLogs, members } from '../db/schema.js';

export class AccessRepository {
  /**
   * Guarda un registro de entrada o intento de acceso
   */
  public static async log(data: {
    memberId: string;
    subscriptionId?: string | null;
    accessResult: 'granted' | 'warning_expiring' | 'denied_expired' | 'denied_inactive';
    message: string;
  }) {
    const result = await db
      .insert(accessLogs)
      .values({
        memberId: data.memberId,
        subscriptionId: data.subscriptionId || null,
        accessResult: data.accessResult,
        message: data.message,
      })
      .returning();

    return result[0]!;
  }

  /**
   * Obtiene los registros de acceso más recientes con nombre del miembro
   */
  public static async findRecent(limit: number = 30) {
    return await db
      .select({
        log: accessLogs,
        member: {
          id: members.id,
          firstName: members.firstName,
          lastName: members.lastName,
          documentNumber: members.documentNumber,
        },
      })
      .from(accessLogs)
      .innerJoin(members, eq(accessLogs.memberId, members.id))
      .orderBy(desc(accessLogs.timestamp))
      .limit(limit);
  }
}
