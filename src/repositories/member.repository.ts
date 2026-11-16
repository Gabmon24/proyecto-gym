import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { members } from '../db/schema.js';
import type { CreateMemberInput, UpdateMemberInput } from '../schemas/member.schema.js';

export class MemberRepository {
  /**
   * Busca un miembro por su número de cédula o documento de identidad
   */
  public static async findByDocument(documentNumber: string) {
    const result = await db
      .select()
      .from(members)
      .where(eq(members.documentNumber, documentNumber))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Busca un miembro por su identificador UUID único
   */
  public static async findById(id: string) {
    const result = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Obtiene la lista de todos los miembros ordenados por fecha de registro
   */
  public static async findAll(limit: number = 50, offset: number = 0) {
    return await db
      .select()
      .from(members)
      .orderBy(desc(members.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Registra un nuevo miembro en la base de datos
   */
  public static async create(input: CreateMemberInput) {
    const result = await db
      .insert(members)
      .values({
        documentNumber: input.documentNumber,
        documentType: input.documentType,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone || null,
        email: input.email || null,
        emergencyContactName: input.emergencyContactName || null,
        emergencyContactPhone: input.emergencyContactPhone || null,
        medicalNotes: input.medicalNotes || null,
        status: 'active',
      })
      .returning();

    return result[0]!;
  }

  /**
   * Actualiza los datos de un miembro existente
   */
  public static async update(id: string, input: UpdateMemberInput) {
    const result = await db
      .update(members)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();

    return result[0] || null;
  }
}
