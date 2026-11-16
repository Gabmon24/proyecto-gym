import React from 'react';
import { Calendar, CreditCard, Check, Zap } from 'lucide-react';

export function PlansAndHolidays() {
  const plans = [
    {
      name: 'Mensualidad Estándar',
      price: '$ 60.000 COP',
      period: 'por mes',
      badge: 'Más Popular',
      highlight: true,
      features: [
        'Acceso ilimitado a zona de máquinas y pesas',
        'Registro digital por cédula (Check-in rápido)',
        'Vigencia exacta de 30 días calendario',
        'Pagos por Nequi, Daviplata o Efectivo',
      ],
    },
    {
      name: 'Plan Trimestral',
      price: '$ 160.000 COP',
      period: 'por 3 meses',
      badge: 'Ahorro $20.000',
      highlight: false,
      features: [
        'Todos los beneficios del plan mensual',
        'Ahorro del 11% sobre el valor individual',
        '90 días continuos garantizados',
        'Opción de congelamiento hasta por 7 días',
      ],
    },
    {
      name: 'Tiquera / Pase Diario',
      price: '$ 10.000 COP',
      period: 'por sesión',
      badge: 'Flexible',
      highlight: false,
      features: [
        'Acceso para una sola jornada',
        'Ideal para visitantes o deportistas esporádicos',
        'Sin cláusulas ni permanencia',
      ],
    },
  ];

  const upcomingHolidays = [
    { name: 'Día de la Independencia', date: 'Lunes, 20 de Julio de 2026', type: 'Festivo Nacional' },
    { name: 'Batalla de Boyacá', date: 'Viernes, 7 de Agosto de 2026', type: 'Festivo Nacional' },
    { name: 'Asunción de la Virgen', date: 'Lunes, 17 de Agosto de 2026', type: 'Ley Emiliani' },
    { name: 'Día de la Raza', date: 'Lunes, 12 de Octubre de 2026', type: 'Ley Emiliani' },
  ];

  return (
    <div className="space-y-12">
      {/* Sección 1: Catálogo de Planes en COP */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Tarifas y Membresías 2026
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-2">
            Planes Diseñados para Gimnasios en Colombia
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Precios en pesos colombianos con soporte integrado para pagos locales mediante Nequi, Daviplata y Efectivo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`p-7 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                plan.highlight
                  ? 'card-craft-active bg-gradient-to-b from-emerald-950/20 to-black/40'
                  : 'card-craft hover:border-white/20'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 right-6">
                  <span
                    className={`text-[11px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      plan.highlight
                        ? 'bg-emerald-400 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-300 border border-white/10'
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">{plan.period}</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                    plan.highlight
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-zinc-950'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Asignar a Miembro
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 2: Motor de Festivos de Colombia (Ley Emiliani) */}
      <div className="card-craft p-8 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">
                Motor de Festivos Nacionales (Colombia)
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Cálculo automatizado bajo la Ley Emiliani (18 festivos anuales) para control de horarios y compensación.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Ley 51 de 1983 Integrada
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {upcomingHolidays.map((holiday, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  {holiday.type}
                </span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h4 className="font-bold text-white text-sm mt-2">{holiday.name}</h4>
              <p className="text-xs font-mono text-emerald-400 mt-1">{holiday.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
