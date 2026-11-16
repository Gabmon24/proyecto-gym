import { ColombianHolidaysService } from './colombian-holidays.service.js';

export type SubscriptionStatus = 'active' | 'expiring_soon' | 'expired' | 'frozen';
export type AccessEvaluationResult = 'granted' | 'warning_expiring' | 'denied_expired' | 'denied_inactive';

export interface MembershipStatusInfo {
  status: SubscriptionStatus;
  daysRemaining: number;
  isExpired: boolean;
  isExpiringSoon: boolean; // Vence en 3 días o menos
}

export interface AccessCheckResult {
  allowed: boolean;
  result: AccessEvaluationResult;
  message: string;
}

export class MembershipService {
  /**
   * Formatea un valor numérico a pesos colombianos (COP) estándar
   * Ej: 60000 -> "$ 60.000 COP"
   */
  public static formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount) + ' COP';
  }

  /**
   * Calcula la fecha exacta de corte/vencimiento a partir de la fecha de inicio,
   * sumando los meses contratados y cualquier compensación adicional (gracia o festivos).
   */
  public static calculateExpirationDate(
    startDate: Date,
    monthsDuration: number,
    options?: {
      bonusDays?: number;
      compensateHolidays?: boolean;
    }
  ): Date {
    const expiration = new Date(startDate);
    expiration.setMonth(expiration.getMonth() + monthsDuration);

    let extraDays = options?.bonusDays || 0;

    // Si el gimnasio aplica política de compensar días festivos en el periodo
    if (options?.compensateHolidays) {
      const holidaysCount = ColombianHolidaysService.countHolidaysInRange(startDate, expiration);
      extraDays += holidaysCount;
    }

    if (extraDays > 0) {
      expiration.setDate(expiration.getDate() + extraDays);
    }

    return expiration;
  }

  /**
   * Determina el estado dinámico y los días restantes de una suscripción
   */
  public static getSubscriptionStatus(endDate: Date, referenceDate: Date = new Date()): MembershipStatusInfo {
    const msInDay = 1000 * 60 * 60 * 24;
    const diffMs = endDate.getTime() - referenceDate.getTime();
    const daysRemaining = Math.ceil(diffMs / msInDay);

    if (daysRemaining <= 0) {
      return {
        status: 'expired',
        daysRemaining: 0,
        isExpired: true,
        isExpiringSoon: false,
      };
    }

    if (daysRemaining <= 3) {
      return {
        status: 'expiring_soon',
        daysRemaining,
        isExpired: false,
        isExpiringSoon: true,
      };
    }

    return {
      status: 'active',
      daysRemaining,
      isExpired: false,
      isExpiringSoon: false,
    };
  }

  /**
   * Evalúa si un usuario puede ingresar al gimnasio (Check-in rápido en recepción)
   */
  public static evaluateAccess(
    memberStatus: 'active' | 'inactive' | 'banned',
    statusInfo: MembershipStatusInfo,
    memberName: string
  ): AccessCheckResult {
    // 1. Bloqueo si el miembro fue suspendido o está inactivo administrativamente
    if (memberStatus !== 'active') {
      return {
        allowed: false,
        result: 'denied_inactive',
        message: `Acceso DENEGADO para ${memberName}. El miembro se encuentra en estado inactivo o suspendido.`,
      };
    }

    // 2. Bloqueo si la mensualidad expiró
    if (statusInfo.isExpired) {
      return {
        allowed: false,
        result: 'denied_expired',
        message: `Acceso DENEGADO para ${memberName}. Su mensualidad ha vencido. Por favor renovar en recepción.`,
      };
    }

    // 3. Alerta de aviso si vence pronto (3 días o menos), pero permitiendo entrar
    if (statusInfo.isExpiringSoon) {
      return {
        allowed: true,
        result: 'warning_expiring',
        message: `¡Bienvenido, ${memberName}! Atención: Tu mensualidad vence en ${statusInfo.daysRemaining} día(s). Recuerda renovar pronto.`,
      };
    }

    // 4. Acceso regular autorizado
    return {
      allowed: true,
      result: 'granted',
      message: `¡Bienvenido, ${memberName}! Acceso autorizado. Te quedan ${statusInfo.daysRemaining} días de suscripción.`,
    };
  }
}
