export interface PaymentRecord {
  id: string;
  memberId: string;
  memberName: string;
  concept: string; // 'Mensualidad Estándar', 'Plan Trimestral', 'Pase Diario'
  amountCOP: number;
  paymentMethod: 'cash' | 'nequi' | 'daviplata' | 'transfer' | 'card';
  timestamp: Date;
}

export interface ShiftSummary {
  totalRevenueCOP: number;
  byMethod: {
    cash: number;
    nequi: number;
    daviplata: number;
    transfer: number;
    card: number;
  };
  totalTransactions: number;
  expectedCashInDrawer: number;
}

export class CashRegisterService {
  /**
   * Calcula el resumen financiero consolidado a partir de una lista de pagos y la base inicial de caja
   */
  public static calculateShiftSummary(
    payments: PaymentRecord[],
    initialCashBaseCOP: number = 0
  ): ShiftSummary {
    const summary: ShiftSummary = {
      totalRevenueCOP: 0,
      byMethod: {
        cash: 0,
        nequi: 0,
        daviplata: 0,
        transfer: 0,
        card: 0,
      },
      totalTransactions: payments.length,
      expectedCashInDrawer: initialCashBaseCOP,
    };

    for (const payment of payments) {
      summary.totalRevenueCOP += payment.amountCOP;

      if (summary.byMethod[payment.paymentMethod] !== undefined) {
        summary.byMethod[payment.paymentMethod] += payment.amountCOP;
      }
    }

    // El dinero en efectivo esperado es la base inicial más las ventas en efectivo
    summary.expectedCashInDrawer = initialCashBaseCOP + summary.byMethod.cash;

    return summary;
  }

  /**
   * Calcula el arqueo de caja comparando el dinero contado físicamente contra el esperado
   */
  public static calculateDiscrepancy(
    actualCashCountedCOP: number,
    expectedCashCOP: number
  ): {
    differenceCOP: number;
    status: 'balanced' | 'surplus' | 'shortage';
    message: string;
  } {
    const differenceCOP = actualCashCountedCOP - expectedCashCOP;

    if (differenceCOP === 0) {
      return {
        differenceCOP: 0,
        status: 'balanced',
        message: 'Caja cuadrada perfectamente. Cero descuadres.',
      };
    }

    if (differenceCOP > 0) {
      return {
        differenceCOP,
        status: 'surplus',
        message: `Sobrante en caja de $ ${differenceCOP.toLocaleString('es-CO')} COP.`,
      };
    }

    return {
      differenceCOP,
      status: 'shortage',
      message: `Faltante en caja de $ ${Math.abs(differenceCOP).toLocaleString('es-CO')} COP.`,
    };
  }
}
