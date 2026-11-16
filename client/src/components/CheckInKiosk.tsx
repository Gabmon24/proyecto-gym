import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Search, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface CheckInResponse {
  allowed: boolean;
  result: 'granted' | 'warning_expiring' | 'denied_expired' | 'denied_inactive';
  message: string;
  member?: {
    id: string;
    name: string;
    documentNumber: string;
    planName?: string;
    daysRemaining?: number;
    expirationDate?: string;
  };
}

export function CheckInKiosk() {
  const [documentInput, setDocumentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<CheckInResponse | null>(null);
  const [recentLogs, setRecentLogs] = useState<Array<{ name: string; doc: string; time: string; result: string }>>([
    { name: 'Carlos Mendoza', doc: '1020304050', time: 'Hace 5 min', result: 'granted' },
    { name: 'Andrea Gómez', doc: '1030405060', time: 'Hace 12 min', result: 'warning_expiring' },
  ]);

  const handleCheckIn = async (docToSearch?: string) => {
    const doc = (docToSearch || documentInput).trim();
    if (!doc) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/access/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentNumber: doc }),
      });

      const data = await response.json();

      if (data) {
        setLastCheckIn(data);
        if (data.member) {
          setRecentLogs((prev) => [
            {
              name: data.member.name,
              doc: data.member.documentNumber,
              time: 'Justo ahora',
              result: data.result,
            },
            ...prev.slice(0, 4),
          ]);
        }
      }
    } catch (err) {
      // Fallback offline / demostración local si la API aún no está conectada
      console.warn('Conexión con backend falló, usando emulación de prueba:', err);
      simulateCheckIn(doc);
    } finally {
      setLoading(false);
      setDocumentInput('');
    }
  };

  const simulateCheckIn = (doc: string) => {
    if (doc === '1020304050') {
      const simulated: CheckInResponse = {
        allowed: true,
        result: 'granted',
        message: '¡Bienvenido, Carlos Mendoza! Acceso autorizado. Te quedan 20 días de suscripción.',
        member: { id: '1', name: 'Carlos Mendoza', documentNumber: doc, planName: 'Mensualidad Estándar ($60.000 COP)', daysRemaining: 20 },
      };
      setLastCheckIn(simulated);
    } else if (doc === '1030405060') {
      const simulated: CheckInResponse = {
        allowed: true,
        result: 'warning_expiring',
        message: '¡Bienvenido, Andrea Gómez! Atención: Tu mensualidad vence en 2 días. Recuerda renovar en recepción.',
        member: { id: '2', name: 'Andrea Gómez', documentNumber: doc, planName: 'Mensualidad Estándar ($60.000 COP)', daysRemaining: 2 },
      };
      setLastCheckIn(simulated);
    } else {
      const simulated: CheckInResponse = {
        allowed: false,
        result: 'denied_expired',
        message: `Acceso DENEGADO para documento ${doc}. Mensualidad vencida o sin registro activo.`,
        member: { id: '3', name: 'Usuario Desconocido', documentNumber: doc, daysRemaining: 0 },
      };
      setLastCheckIn(simulated);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna Izquierda: Terminal de Marcación Rápida */}
      <div className="lg:col-span-2 space-y-6">
        <div className="card-craft p-8 rounded-2xl relative overflow-hidden">
          {/* Header del Kiosko */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                Control de Acceso en Tiempo Real
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                Marcación Rápida por Cédula
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistema Operativo
            </div>
          </div>

          {/* Formulario de Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckIn();
            }}
            className="mt-6"
          >
            <label className="block text-sm text-zinc-400 mb-2 font-medium">
              Digita el número de documento del miembro:
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={documentInput}
                  onChange={(e) => setDocumentInput(e.target.value)}
                  placeholder="Ej: 1020304050"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/15 text-white text-xl font-mono focus:outline-none focus:border-emerald-400 transition"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || !documentInput.trim()}
                className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold rounded-xl flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Validando...' : 'Marcar Entrada'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Accesos rápidos de prueba */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-mono text-[11px] text-zinc-500 uppercase">Cédulas de prueba:</span>
            <button
              onClick={() => handleCheckIn('1020304050')}
              className="px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-mono transition cursor-pointer"
            >
              1020304050 (Activa)
            </button>
            <button
              onClick={() => handleCheckIn('1030405060')}
              className="px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-mono transition cursor-pointer"
            >
              1030405060 (Por vencer)
            </button>
            <button
              onClick={() => handleCheckIn('9999999999')}
              className="px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-mono transition cursor-pointer"
            >
              9999999999 (Vencida)
            </button>
          </div>

          {/* Pantalla de Resultado (Semáforo de Acceso) */}
          {lastCheckIn && (
            <div
              className={`mt-6 p-6 rounded-xl border transition-all duration-300 ${
                lastCheckIn.result === 'granted'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : lastCheckIn.result === 'warning_expiring'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {lastCheckIn.result === 'granted' && (
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 flex-shrink-0 mt-1" />
                )}
                {lastCheckIn.result === 'warning_expiring' && (
                  <AlertTriangle className="w-10 h-10 text-amber-400 flex-shrink-0 mt-1" />
                )}
                {(lastCheckIn.result === 'denied_expired' || lastCheckIn.result === 'denied_inactive') && (
                  <XCircle className="w-10 h-10 text-rose-400 flex-shrink-0 mt-1" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight">
                      {lastCheckIn.result === 'granted' && 'ACCESO AUTORIZADO'}
                      {lastCheckIn.result === 'warning_expiring' && 'ACCESO CON ADVERTENCIA'}
                      {lastCheckIn.result === 'denied_expired' && 'ACCESO DENEGADO'}
                      {lastCheckIn.result === 'denied_inactive' && 'USUARIO INACTIVO O SUSPENDIDO'}
                    </h3>
                    {lastCheckIn.member?.daysRemaining !== undefined && (
                      <span className="font-mono text-sm px-3 py-1 rounded-md bg-black/40 border border-white/10 font-bold">
                        {lastCheckIn.member.daysRemaining} días restantes
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-base opacity-90">{lastCheckIn.message}</p>

                  {lastCheckIn.member && (
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-zinc-400 block">Miembro:</span>
                        <span className="text-white font-bold">{lastCheckIn.member.name}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Documento:</span>
                        <span className="text-white">{lastCheckIn.member.documentNumber}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block">Plan Asociado:</span>
                        <span className="text-white">{lastCheckIn.member.planName || 'Mensualidad Estándar'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Bitácora de Accesos Recientes */}
      <div className="space-y-6">
        <div className="card-craft p-6 rounded-2xl h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Entradas Recientes
              </h3>
              <span className="text-xs font-mono text-zinc-500">Hoy</span>
            </div>

            <div className="mt-4 space-y-3">
              {recentLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:bg-white/[0.04] transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        log.result === 'granted'
                          ? 'bg-emerald-400'
                          : log.result === 'warning_expiring'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{log.name}</p>
                      <p className="text-xs font-mono text-zinc-500">C.C. {log.doc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 text-xs text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Base de Datos Sincronizada
            </span>
            <span className="font-mono text-emerald-400">PostgreSQL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
