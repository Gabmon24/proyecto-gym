import { describe, it, expect } from 'vitest';
import { EmailService } from '../email.service.js';

describe('EmailService (Notificaciones de Verificación y Comprobantes)', () => {
  const dummyMember = {
    firstName: 'Carlos',
    lastName: 'Mendoza',
    documentType: 'CC',
    documentNumber: '1020304050',
    email: 'carlos.mendoza@email.com',
    phone: '3001234567',
    emergencyContactName: 'Marta Mendoza',
    emergencyContactPhone: '3109876543',
  };

  const dummySubscription = {
    planName: 'Mensualidad Estándar',
    amountPaidCOP: 60000,
    startDate: '2026-11-16',
    endDate: '2026-12-16',
    paymentMethod: 'nequi',
  };

  it('genera el HTML del correo conteniendo los datos personales verificados', () => {
    const html = EmailService.generateWelcomeEmailHtml(dummyMember, dummySubscription);

    expect(html).toContain('Carlos Mendoza');
    expect(html).toContain('1020304050');
    expect(html).toContain('3001234567');
    expect(html).toContain('Marta Mendoza');
  });

  it('incluye los detalles del plan en pesos colombianos y método de pago', () => {
    const html = EmailService.generateWelcomeEmailHtml(dummyMember, dummySubscription);

    expect(html).toContain('Mensualidad Estándar');
    expect(html).toContain('60.000');
    expect(html).toContain('COP');
    expect(html).toContain('NEQUI');
    expect(html).toContain('2026-12-16');
  });

  it('registra el correo en la bandeja de auditoría al enviarse', async () => {
    const result = await EmailService.sendWelcomeEmail(dummyMember, dummySubscription);

    expect(result.success).toBe(true);
    expect(result.email).toBe('carlos.mendoza@email.com');

    const sentList = EmailService.getSentEmails();
    expect(sentList.length).toBeGreaterThan(0);
    expect(sentList[0]?.to).toBe('carlos.mendoza@email.com');
  });
});
