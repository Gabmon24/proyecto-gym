import { describe, it, expect } from 'vitest';
import { CashRegisterService, type PaymentRecord } from '../cash-register.service.js';

describe('CashRegisterService (Control Financiero y Arqueo de Caja)', () => {
  const dummyPayments: PaymentRecord[] = [
    {
      id: 'p1',
      memberId: 'm1',
      memberName: 'Carlos Mendoza',
      concept: 'Mensualidad Estándar',
      amountCOP: 60000,
      paymentMethod: 'nequi',
      timestamp: new Date(),
    },
    {
      id: 'p2',
      memberId: 'm2',
      memberName: 'Andrea Gómez',
      concept: 'Mensualidad Estándar',
      amountCOP: 60000,
      paymentMethod: 'cash',
      timestamp: new Date(),
    },
    {
      id: 'p3',
      memberId: 'm3',
      memberName: 'Valentina Castro',
      concept: 'Plan Trimestral',
      amountCOP: 160000,
      paymentMethod: 'daviplata',
      timestamp: new Date(),
    },
  ];

  it('calcula los ingresos totales y los discrimina correctamente por método de pago', () => {
    const summary = CashRegisterService.calculateShiftSummary(dummyPayments, 50000);

    expect(summary.totalRevenueCOP).toBe(280000); // 60k + 60k + 160k
    expect(summary.byMethod.nequi).toBe(60000);
    expect(summary.byMethod.cash).toBe(60000);
    expect(summary.byMethod.daviplata).toBe(160000);
    expect(summary.expectedCashInDrawer).toBe(110000); // 50k base + 60k cash
  });

  it('detecta una caja cuadrada sin descuadres', () => {
    const arqueo = CashRegisterService.calculateDiscrepancy(110000, 110000);
    expect(arqueo.status).toBe('balanced');
    expect(arqueo.differenceCOP).toBe(0);
    expect(arqueo.message).toContain('Caja cuadrada');
  });

  it('detecta un faltante en efectivo', () => {
    const arqueo = CashRegisterService.calculateDiscrepancy(105000, 110000); // Faltan 5.000 COP
    expect(arqueo.status).toBe('shortage');
    expect(arqueo.differenceCOP).toBe(-5000);
    expect(arqueo.message).toContain('Faltante');
  });

  it('detecta un sobrante en efectivo', () => {
    const arqueo = CashRegisterService.calculateDiscrepancy(112000, 110000); // Sobran 2.000 COP
    expect(arqueo.status).toBe('surplus');
    expect(arqueo.differenceCOP).toBe(2000);
    expect(arqueo.message).toContain('Sobrante');
  });
});
