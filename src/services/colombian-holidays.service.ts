/**
 * Motor de Festivos de Colombia (Ley 51 de 1983 - Ley Emiliani)
 * Calcula de forma determinista todos los festivos nacionales de Colombia para cualquier año,
 * incluyendo festivos fijos, festivos trasladados al lunes y festivos dependientes de la Pascua.
 */

export interface Holiday {
  date: Date;
  dateString: string; // YYYY-MM-DD
  name: string;
}

export class ColombianHolidaysService {
  /**
   * Algoritmo de Butcher/Meeus para calcular el Domingo de Pascua de cualquier año
   */
  private static getEasterSunday(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = abril
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(Date.UTC(year, month - 1, day));
  }

  /**
   * Traslada una fecha al siguiente lunes si no cae en lunes (Ley Emiliani)
   */
  private static moveToNextMonday(date: Date): Date {
    const dayOfWeek = date.getUTCDay(); // 0 = Domingo, 1 = Lunes, etc.
    if (dayOfWeek === 1) return date; // Ya es lunes

    const daysToAdd = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + daysToAdd);
    return result;
  }

  /**
   * Obtiene la lista completa de los 18 festivos de Colombia para un año específico
   */
  public static getHolidays(year: number): Holiday[] {
    const easter = this.getEasterSunday(year);

    const addDaysToEaster = (days: number): Date => {
      const d = new Date(easter);
      d.setUTCDate(d.getUTCDate() + days);
      return d;
    };

    const rawList: Array<{ date: Date; name: string; isEmiliani: boolean }> = [
      // Festivos fijos que no se mueven
      { date: new Date(Date.UTC(year, 0, 1)), name: 'Año Nuevo', isEmiliani: false },
      { date: new Date(Date.UTC(year, 4, 1)), name: 'Día del Trabajo', isEmiliani: false },
      { date: new Date(Date.UTC(year, 6, 20)), name: 'Día de la Independencia', isEmiliani: false },
      { date: new Date(Date.UTC(year, 7, 7)), name: 'Batalla de Boyacá', isEmiliani: false },
      { date: new Date(Date.UTC(year, 11, 8)), name: 'Inmaculada Concepción', isEmiliani: false },
      { date: new Date(Date.UTC(year, 11, 25)), name: 'Navidad', isEmiliani: false },

      // Festivos religiosos vinculados a Semana Santa (no se trasladan al lunes)
      { date: addDaysToEaster(-3), name: 'Jueves Santo', isEmiliani: false },
      { date: addDaysToEaster(-2), name: 'Viernes Santo', isEmiliani: false },

      // Festivos fijos que se trasladan al siguiente lunes (Ley Emiliani)
      { date: new Date(Date.UTC(year, 0, 6)), name: 'Reyes Magos', isEmiliani: true },
      { date: new Date(Date.UTC(year, 2, 19)), name: 'Día de San José', isEmiliani: true },
      { date: new Date(Date.UTC(year, 5, 29)), name: 'San Pedro y San Pablo', isEmiliani: true },
      { date: new Date(Date.UTC(year, 7, 15)), name: 'Asunción de la Virgen', isEmiliani: true },
      { date: new Date(Date.UTC(year, 9, 12)), name: 'Día de la Raza', isEmiliani: true },
      { date: new Date(Date.UTC(year, 10, 1)), name: 'Todos los Santos', isEmiliani: true },
      { date: new Date(Date.UTC(year, 10, 11)), name: 'Independencia de Cartagena', isEmiliani: true },

      // Festivos móviles vinculados a Pascua que se trasladan al lunes
      { date: addDaysToEaster(43), name: 'Ascensión del Señor', isEmiliani: true },
      { date: addDaysToEaster(64), name: 'Corpus Christi', isEmiliani: true },
      { date: addDaysToEaster(71), name: 'Sagrado Corazón de Jesús', isEmiliani: true },
    ];

    return rawList
      .map((item) => {
        const finalDate = item.isEmiliani ? this.moveToNextMonday(item.date) : item.date;
        const yearStr = finalDate.getUTCFullYear();
        const monthStr = String(finalDate.getUTCMonth() + 1).padStart(2, '0');
        const dayStr = String(finalDate.getUTCDate()).padStart(2, '0');

        return {
          date: finalDate,
          dateString: `${yearStr}-${monthStr}-${dayStr}`,
          name: item.name,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Verifica si una fecha dada es festivo en Colombia
   */
  public static isHoliday(date: Date): { isHoliday: boolean; holidayName?: string } {
    const year = date.getUTCFullYear();
    const holidays = this.getHolidays(year);

    const yearStr = date.getUTCFullYear();
    const monthStr = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getUTCDate()).padStart(2, '0');
    const targetString = `${yearStr}-${monthStr}-${dayStr}`;

    const match = holidays.find((h) => h.dateString === targetString);
    if (match) {
      return { isHoliday: true, holidayName: match.name };
    }
    return { isHoliday: false };
  }

  /**
   * Cuenta cuántos festivos existen en un rango de fechas (útil para compensaciones)
   */
  public static countHolidaysInRange(startDate: Date, endDate: Date): number {
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      if (this.isHoliday(current).isHoliday) {
        count++;
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return count;
  }
}
