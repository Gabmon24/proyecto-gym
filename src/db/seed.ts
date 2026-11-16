import { db } from './index.js';
import { plans, members, subscriptions, accessLogs } from './schema.js';
import { MembershipService } from '../services/membership.service.js';

export async function seedDatabase() {
  console.log('🌱 Iniciando carga de datos iniciales para Proyecto Gym...');

  try {
    // 1. Insertar Planes Predeterminados
    console.log('📌 Insertando catálogo de planes en COP...');
    const insertedPlans = await db
      .insert(plans)
      .values([
        {
          name: 'Mensualidad Estándar',
          priceCOP: 60000,
          durationMonths: 1,
          durationDays: 30,
          description: 'Acceso ilimitado a máquinas y zona de pesas durante 1 mes calendario.',
          isActive: true,
        },
        {
          name: 'Plan Trimestral (Ahorro)',
          priceCOP: 160000,
          durationMonths: 3,
          durationDays: 90,
          description: '3 meses continuos. Ahorro de $20.000 COP sobre el valor mensual.',
          isActive: true,
        },
        {
          name: 'Pase Diario',
          priceCOP: 10000,
          durationMonths: 0,
          durationDays: 1,
          description: 'Pase único válido para una sola sesión de entrenamiento.',
          isActive: true,
        },
      ])
      .returning();

    const planMensual = insertedPlans[0]!;

    // 2. Insertar Miembros de Ejemplo
    console.log('👤 Insertando miembros de demostración...');
    const [carlos, andrea, jorge] = await db
      .insert(members)
      .values([
        {
          documentNumber: '1020304050',
          documentType: 'CC',
          firstName: 'Carlos',
          lastName: 'Mendoza',
          phone: '3001234567',
          email: 'carlos.mendoza@email.com',
          emergencyContactName: 'Marta Mendoza (Madre)',
          emergencyContactPhone: '3109876543',
          medicalNotes: 'Hipertensión leve bajo control.',
          status: 'active',
        },
        {
          documentNumber: '1030405060',
          documentType: 'CC',
          firstName: 'Andrea',
          lastName: 'Gómez',
          phone: '3157654321',
          email: 'andrea.gomez@email.com',
          emergencyContactName: 'Felipe Gómez (Hermano)',
          emergencyContactPhone: '3201122334',
          medicalNotes: 'Sin antecedentes relevantes.',
          status: 'active',
        },
        {
          documentNumber: '1040506070',
          documentType: 'CC',
          firstName: 'Jorge',
          lastName: 'Ramírez',
          phone: '3114455667',
          email: 'jorge.ramirez@email.com',
          status: 'banned', // Miembro suspendido para probar el bloqueo
        },
      ])
      .returning();

    // 3. Crear Suscripciones para los Miembros
    console.log('💳 Asignando membresías activas y vencidas...');
    const ahora = new Date();

    // Carlos: Membresía activa con 20 días restantes
    const inicioCarlos = new Date(ahora);
    inicioCarlos.setDate(inicioCarlos.getDate() - 10);
    const finCarlos = MembershipService.calculateExpirationDate(inicioCarlos, 1);

    await db.insert(subscriptions).values({
      memberId: carlos!.id,
      planId: planMensual.id,
      startDate: inicioCarlos,
      endDate: finCarlos,
      graceDays: 0,
      status: 'active',
      paymentMethod: 'nequi',
      amountPaidCOP: 60000,
      notes: 'Transferencia Nequi confirmada.',
    });

    // Andrea: Membresía por vencer en 2 días (alerta amarilla)
    const inicioAndrea = new Date(ahora);
    inicioAndrea.setDate(inicioAndrea.getDate() - 28);
    const finAndrea = new Date(ahora);
    finAndrea.setDate(finAndrea.getDate() + 2); // Le quedan 2 días

    await db.insert(subscriptions).values({
      memberId: andrea!.id,
      planId: planMensual.id,
      startDate: inicioAndrea,
      endDate: finAndrea,
      graceDays: 0,
      status: 'expiring_soon',
      paymentMethod: 'cash',
      amountPaidCOP: 60000,
      notes: 'Pago en efectivo en recepción.',
    });

    console.log('✅ Base de datos poblada exitosamente con datos de prueba.');
  } catch (error) {
    console.error('❌ Error durante la carga de datos iniciales:', error);
  }
}
