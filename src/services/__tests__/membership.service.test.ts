import { describe, it, expect } from 'vitest';
import { MembershipService } from '../membership.service.js';
import { ColombianHolidaysService } from '../colombian-holidays.service.js';

describe('MembershipService (Lógica de Dominio del Gimnasio)', () => {
  it('formatea correctamente los montos en Pesos Colombianos (COP)', () => {
    const formatted = MembershipService.formatCOP(60000);
    expect(formatted).toContain('60.000');
    expect(formatted).toContain('COP');
  });

  it('calcula la fecha de vencimiento sumando 1 mes exacto', () => {
    const inicio = new Date('2026-03-10T12:00:00Z');
    const vencimiento = MembershipService.calculateExpirationDate(inicio, 1);

    expect(vencimiento.getUTCMonth()).toBe(3); // Abril (base 0)
    expect(vencimiento.getUTCDate()).toBe(10);
  });

  it('suma días de gracia adicionales a la fecha de vencimiento', () => {
    const inicio = new Date('2026-03-10T12:00:00Z');
    const vencimiento = MembershipService.calculateExpirationDate(inicio, 1, { bonusDays: 5 });

    expect(vencimiento.getUTCDate()).toBe(15);
  });

  it('determina correctamente cuando una membresía vence en 3 días o menos (expiring_soon)', () => {
    const ahora = new Date('2026-04-01T08:00:00Z');
    const vencePronto = new Date('2026-04-03T08:00:00Z'); // 2 días restantes

    const status = MembershipService.getSubscriptionStatus(vencePronto, ahora);
    expect(status.status).toBe('expiring_soon');
    expect(status.isExpiringSoon).toBe(true);
    expect(status.daysRemaining).toBe(2);
  });

  it('determina que una membresía está vencida si los días restantes son 0 o negativos', () => {
    const ahora = new Date('2026-04-10T08:00:00Z');
    const vencida = new Date('2026-04-08T08:00:00Z'); // Venció hace 2 días

    const status = MembershipService.getSubscriptionStatus(vencida, ahora);
    expect(status.status).toBe('expired');
    expect(status.isExpired).toBe(true);
    expect(status.daysRemaining).toBe(0);
  });

  describe('Control de Acceso / Check-in', () => {
    it('autoriza el acceso si la membresía está activa y tiene días suficientes', () => {
      const statusInfo = {
        status: 'active' as const,
        daysRemaining: 15,
        isExpired: false,
        isExpiringSoon: false,
      };

      const result = MembershipService.evaluateAccess('active', statusInfo, 'Gabriel');
      expect(result.allowed).toBe(true);
      expect(result.result).toBe('granted');
      expect(result.message).toContain('Acceso autorizado');
    });

    it('permite el acceso pero emite una alerta si vence pronto', () => {
      const statusInfo = {
        status: 'expiring_soon' as const,
        daysRemaining: 2,
        isExpired: false,
        isExpiringSoon: true,
      };

      const result = MembershipService.evaluateAccess('active', statusInfo, 'Gabriel');
      expect(result.allowed).toBe(true);
      expect(result.result).toBe('warning_expiring');
      expect(result.message).toContain('Atención');
    });

    it('bloquea el acceso si la mensualidad ha vencido', () => {
      const statusInfo = {
        status: 'expired' as const,
        daysRemaining: 0,
        isExpired: true,
        isExpiringSoon: false,
      };

      const result = MembershipService.evaluateAccess('active', statusInfo, 'Gabriel');
      expect(result.allowed).toBe(false);
      expect(result.result).toBe('denied_expired');
      expect(result.message).toContain('DENEGADO');
    });

    it('bloquea el acceso si el miembro está suspendido administrativamente', () => {
      const statusInfo = {
        status: 'active' as const,
        daysRemaining: 20,
        isExpired: false,
        isExpiringSoon: false,
      };

      const result = MembershipService.evaluateAccess('banned', statusInfo, 'Juan Pérez');
      expect(result.allowed).toBe(false);
      expect(result.result).toBe('denied_inactive');
      expect(result.message).toContain('DENEGADO');
    });
  });
});

describe('ColombianHolidaysService (Motor de Festivos Nacionales)', () => {
  it('identifica correctamente festivos fijos de Colombia (20 de Julio, 7 de Agosto, 25 de Diciembre)', () => {
    const independencia = new Date('2026-07-20T12:00:00Z');
    const navidad = new Date('2026-12-25T12:00:00Z');

    expect(ColombianHolidaysService.isHoliday(independencia).isHoliday).toBe(true);
    expect(ColombianHolidaysService.isHoliday(navidad).isHoliday).toBe(true);
  });

  it('reconoce que un día ordinario no es festivo', () => {
    const diaOrdinario = new Date('2026-02-10T12:00:00Z');
    expect(ColombianHolidaysService.isHoliday(diaOrdinario).isHoliday).toBe(false);
  });

  it('calcula los 18 festivos de Colombia para el año 2026', () => {
    const holidays = ColombianHolidaysService.getHolidays(2026);
    expect(holidays.length).toBe(18);
  });
});
