import React, { useState, useMemo, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  Search,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Filter,
  Phone,
  X,
  DollarSign,
  Wallet,
  Receipt,
  Coins,
  Send,
  Mail,
  Printer,
  Dumbbell,
  Edit3,
  PauseCircle,
  PlayCircle,
  Trash2,
  Download,
  Save,
  QrCode,
  ShoppingBag,
  Volume2,
  VolumeX,
  Camera,
  Check
} from 'lucide-react';

export const PRESET_AVATARS = [
  { label: 'Hombre Atlético 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: 'Mujer Fitness 1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80' },
  { label: 'Hombre Fuerza 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: 'Mujer Crossfit 2', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
  { label: 'Hombre Musculación 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Mujer Deportista 3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
];

export interface ShopProduct {
  id: string;
  name: string;
  category: 'bebida' | 'suplemento' | 'snack' | 'accesorio';
  priceCOP: number;
  icon: string;
  stock: number;
}

export const INITIAL_SHOP_PRODUCTS: ShopProduct[] = [
  { id: 'prod-1', name: 'Agua Cristal 600ml', category: 'bebida', priceCOP: 2000, icon: '💧', stock: 48 },
  { id: 'prod-2', name: 'Gatorade Frutas 500ml', category: 'bebida', priceCOP: 4500, icon: '⚡', stock: 24 },
  { id: 'prod-3', name: 'Speed Max 250ml', category: 'bebida', priceCOP: 2500, icon: '🔋', stock: 36 },
  { id: 'prod-4', name: 'Red Bull Energy 250ml', category: 'bebida', priceCOP: 7000, icon: '🐂', stock: 12 },
  { id: 'prod-5', name: 'Scoop Proteína Whey Isolate', category: 'suplemento', priceCOP: 6000, icon: '🥤', stock: 50 },
  { id: 'prod-6', name: 'Scoop Creatina Monohidrato', category: 'suplemento', priceCOP: 4000, icon: '💪', stock: 45 },
  { id: 'prod-7', name: 'Barra Proteica Tosh Fit', category: 'snack', priceCOP: 3500, icon: '🍫', stock: 30 },
  { id: 'prod-8', name: 'Toalla Microfibra Gym', category: 'accesorio', priceCOP: 15000, icon: '🏷️', stock: 10 },
];

export interface AnthropometricRecord {
  weightKg: number;
  heightCm: number;
  bodyFatPct?: number;
  muscleMassKg?: number;
  target: 'hipertrofia' | 'definicion' | 'salud' | 'fuerza';
  updatedAt: string;
}

export interface MemberRecord {
  id: string;
  documentNumber: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PASSPORT';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalNotes: string;
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  bodyMetrics?: AnthropometricRecord;
  subscription?: {
    planName: string;
    amountPaidCOP: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'expiring_soon' | 'expired' | 'frozen';
    daysRemaining: number;
    isFrozen?: boolean;
    paymentMethod: 'cash' | 'nequi' | 'daviplata' | 'card' | 'transfer';
  };
}

export interface PaymentTransaction {
  id: string;
  timestamp: string;
  memberName: string;
  documentNumber: string;
  concept: string;
  amountCOP: number;
  paymentMethod: 'cash' | 'nequi' | 'daviplata' | 'transfer';
}

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 6;
    const rotY = (x / (rect.width / 2)) * 6;

    setTransform(`perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.12s ease-out',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

export function GymDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(20);

  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingProgress(70), 250);
    const timer2 = setTimeout(() => setLoadingProgress(100), 550);
    const timer3 = setTimeout(() => setIsLoading(false), 750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const [activeTab, setActiveTab] = useState<'members' | 'kiosk' | 'shop' | 'finances'>('members');

  // Base de datos reactiva de miembros
  const [membersList, setMembersList] = useState<MemberRecord[]>([
    {
      id: 'mem-1',
      documentNumber: '1020304050',
      documentType: 'CC',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      phone: '3001234567',
      email: 'carlos.mendoza@email.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      emergencyContactName: 'Marta Mendoza (Madre)',
      emergencyContactPhone: '3109876543',
      medicalNotes: 'Hipertensión leve bajo control médico.',
      status: 'active',
      createdAt: '2026-01-15',
      bodyMetrics: { weightKg: 82.5, heightCm: 178, bodyFatPct: 16.5, target: 'hipertrofia', updatedAt: '2026-11-01' },
      subscription: {
        planName: 'Mensualidad Estándar',
        amountPaidCOP: 60000,
        startDate: '2026-11-06',
        endDate: '2026-12-06',
        status: 'active',
        daysRemaining: 20,
        isFrozen: false,
        paymentMethod: 'nequi',
      },
    },
    {
      id: 'mem-2',
      documentNumber: '1030405060',
      documentType: 'CC',
      firstName: 'Andrea',
      lastName: 'Gómez',
      phone: '3157654321',
      email: 'andrea.gomez@email.com',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      emergencyContactName: 'Felipe Gómez (Hermano)',
      emergencyContactPhone: '3201122334',
      medicalNotes: 'Lesión antigua en ligamento cruzado rodilla derecha.',
      status: 'active',
      createdAt: '2026-02-10',
      bodyMetrics: { weightKg: 58.0, heightCm: 164, bodyFatPct: 21.0, target: 'definicion', updatedAt: '2026-10-25' },
      subscription: {
        planName: 'Mensualidad Estándar',
        amountPaidCOP: 60000,
        startDate: '2026-10-18',
        endDate: '2026-11-18',
        status: 'expiring_soon',
        daysRemaining: 2,
        isFrozen: false,
        paymentMethod: 'cash',
      },
    },
    {
      id: 'mem-3',
      documentNumber: '1040506070',
      documentType: 'CC',
      firstName: 'Jorge',
      lastName: 'Ramírez',
      phone: '3114455667',
      email: 'jorge.ramirez@email.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      emergencyContactName: 'Sonia Ramírez (Esposa)',
      emergencyContactPhone: '3128899001',
      medicalNotes: 'Ninguna restricción.',
      status: 'banned',
      createdAt: '2026-03-01',
      subscription: {
        planName: 'Mensualidad Estándar',
        amountPaidCOP: 60000,
        startDate: '2026-09-01',
        endDate: '2026-10-01',
        status: 'expired',
        daysRemaining: 0,
        isFrozen: false,
        paymentMethod: 'daviplata',
      },
    },
    {
      id: 'mem-4',
      documentNumber: '1050607080',
      documentType: 'CC',
      firstName: 'Valentina',
      lastName: 'Castro',
      phone: '3189900112',
      email: 'valentina.castro@email.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      emergencyContactName: 'Pedro Castro (Padre)',
      emergencyContactPhone: '3145566778',
      medicalNotes: 'Asma inducida por ejercicio intenso.',
      status: 'active',
      createdAt: '2026-05-20',
      bodyMetrics: { weightKg: 63.5, heightCm: 170, bodyFatPct: 19.5, target: 'fuerza', updatedAt: '2026-10-15' },
      subscription: {
        planName: 'Plan Trimestral',
        amountPaidCOP: 160000,
        startDate: '2026-10-01',
        endDate: '2027-01-01',
        status: 'active',
        daysRemaining: 46,
        isFrozen: false,
        paymentMethod: 'transfer',
      },
    },
  ]);

  const [paymentsLog, setPaymentsLog] = useState<PaymentTransaction[]>([
    {
      id: 'pay-1',
      timestamp: '08:15 AM',
      memberName: 'Carlos Mendoza',
      documentNumber: '1020304050',
      concept: 'Mensualidad Estándar',
      amountCOP: 60000,
      paymentMethod: 'nequi',
    },
    {
      id: 'pay-2',
      timestamp: '09:40 AM',
      memberName: 'Andrea Gómez',
      documentNumber: '1030405060',
      concept: 'Mensualidad Estándar',
      amountCOP: 60000,
      paymentMethod: 'cash',
    },
    {
      id: 'pay-3',
      timestamp: '11:20 AM',
      memberName: 'Valentina Castro',
      documentNumber: '1050607080',
      concept: 'Plan Trimestral',
      amountCOP: 160000,
      paymentMethod: 'transfer',
    },
  ]);

  const [initialCashBase] = useState(50000);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring_soon' | 'expired' | 'frozen'>('all');

  // Modales
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState<MemberRecord | null>(null);
  const [showCashCloseModal, setShowCashCloseModal] = useState(false);

  // Carnet Digital VIP y Audio
  const [showDigitalCard, setShowDigitalCard] = useState<MemberRecord | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Tienda y POS de Mostrador
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>(INITIAL_SHOP_PRODUCTS);
  const [shopCategoryFilter, setShopCategoryFilter] = useState<'all' | 'bebida' | 'suplemento' | 'snack' | 'accesorio'>('all');
  const [sellingProduct, setSellingProduct] = useState<ShopProduct | null>(null);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellPaymentMethod, setSellPaymentMethod] = useState<'cash' | 'nequi' | 'daviplata'>('nequi');
  const [sellBuyerName, setSellBuyerName] = useState('Cliente Mostrador');

  // NUEVO: Modal de Gestión / Edición Integral de Miembro
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [editTab, setEditTab] = useState<'info' | 'subscription' | 'metrics'>('info');

  const [receiptModalData, setReceiptModalData] = useState<{
    member: MemberRecord;
    concept: string;
    amount: number;
    paymentMethod: string;
    endDate: string;
    receiptId: string;
  } | null>(null);

  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [actualCashCounted, setActualCashCounted] = useState<string>('');
  const [shiftClosed, setShiftClosed] = useState(false);

  // Formulario Nuevo Miembro con Avatar Seleccionable
  const [newMemberForm, setNewMemberForm] = useState({
    documentNumber: '',
    documentType: 'CC' as const,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    avatarUrl: PRESET_AVATARS[0].url,
    emergencyContactName: '',
    emergencyContactPhone: '',
    medicalNotes: '',
    planDurationMonths: 1,
    planPriceCOP: 60000,
    paymentMethod: 'nequi' as const,
  });

  // Kiosko Check-In
  const [checkInDoc, setCheckInDoc] = useState('');
  const [checkInResult, setCheckInResult] = useState<{
    status: 'granted' | 'warning' | 'denied';
    title: string;
    message: string;
    member?: MemberRecord;
  } | null>(null);

  const [accessLogs, setAccessLogs] = useState<Array<{ name: string; doc: string; time: string; status: 'granted' | 'warning' | 'denied' }>>([
    { name: 'Carlos Mendoza', doc: '1020304050', time: '13:10', status: 'granted' },
    { name: 'Andrea Gómez', doc: '1030405060', time: '13:02', status: 'warning' },
  ]);

  const cashSummary = useMemo(() => {
    let nequi = 0;
    let daviplata = 0;
    let cash = 0;
    let transfer = 0;
    let totalRevenue = 0;

    for (const p of paymentsLog) {
      totalRevenue += p.amountCOP;
      if (p.paymentMethod === 'nequi') nequi += p.amountCOP;
      if (p.paymentMethod === 'daviplata') daviplata += p.amountCOP;
      if (p.paymentMethod === 'cash') cash += p.amountCOP;
      if (p.paymentMethod === 'transfer') transfer += p.amountCOP;
    }

    return {
      totalRevenue,
      nequi,
      daviplata,
      cash,
      transfer,
      initialCashBase,
      expectedCashInDrawer: initialCashBase + cash,
    };
  }, [paymentsLog, initialCashBase]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#10b981', '#34d399', '#059669', '#ffffff', '#fbbf24'],
    });
  };

  // Sintetizador Web Audio API para Bip de Acceso en Recepción
  const playAudioBeep = (type: 'granted' | 'warning' | 'denied') => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'granted') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'warning') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(196, ctx.currentTime);
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // guard
    }
  };

  // Check-In con Audio-Feedback
  const handleCheckInSubmit = (e?: React.FormEvent, directDoc?: string) => {
    if (e) e.preventDefault();
    const doc = (directDoc || checkInDoc).trim();
    if (!doc) return;

    const found = membersList.find((m) => m.documentNumber === doc);
    const nowTime = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    if (!found) {
      playAudioBeep('denied');
      setCheckInResult({
        status: 'denied',
        title: 'DOCUMENTO NO REGISTRADO',
        message: `El número de documento ${doc} no pertenece a ningún miembro del sistema. Registre al usuario en el directorio.`,
      });
      setAccessLogs(prev => [{ name: 'Desconocido', doc, time: nowTime, status: 'denied' }, ...prev.slice(0, 9)]);
    } else if (found.status === 'banned') {
      playAudioBeep('denied');
      setCheckInResult({
        status: 'denied',
        title: 'ACCESO BLOQUEADO (SUSPENDIDO)',
        message: `El miembro ${found.firstName} ${found.lastName} se encuentra bloqueado administrativamente. Contacte a la gerencia.`,
        member: found,
      });
      setAccessLogs(prev => [{ name: `${found.firstName} ${found.lastName}`, doc, time: nowTime, status: 'denied' }, ...prev.slice(0, 9)]);
    } else if (found.subscription?.isFrozen) {
      playAudioBeep('denied');
      setCheckInResult({
        status: 'denied',
        title: 'MEMBRESÍA CONGELADA / PAUSADA',
        message: `La membresía de ${found.firstName} ${found.lastName} se encuentra congelada temporalmente. Descongela el plan en su ficha de usuario para habilitar el paso.`,
        member: found,
      });
      setAccessLogs(prev => [{ name: `${found.firstName} ${found.lastName}`, doc, time: nowTime, status: 'denied' }, ...prev.slice(0, 9)]);
    } else if (!found.subscription || found.subscription.status === 'expired') {
      playAudioBeep('denied');
      setCheckInResult({
        status: 'denied',
        title: 'MENSUALIDAD VENCIDA',
        message: `La mensualidad de ${found.firstName} ${found.lastName} venció el ${found.subscription?.endDate || 'fecha desconocida'}. Por favor realizar la renovación en caja.`,
        member: found,
      });
      setAccessLogs(prev => [{ name: `${found.firstName} ${found.lastName}`, doc, time: nowTime, status: 'denied' }, ...prev.slice(0, 9)]);
    } else if (found.subscription.status === 'expiring_soon') {
      playAudioBeep('warning');
      setCheckInResult({
        status: 'warning',
        title: 'ACCESO CON ADVERTENCIA (VENCE PRONTO)',
        message: `¡Bienvenido(a) ${found.firstName}! Tu mensualidad vence en ${found.subscription.daysRemaining} días. Recuerda renovar para no interrumpir tu entrenamiento.`,
        member: found,
      });
      setAccessLogs(prev => [{ name: `${found.firstName} ${found.lastName}`, doc, time: nowTime, status: 'warning' }, ...prev.slice(0, 9)]);
    } else {
      playAudioBeep('granted');
      triggerCelebration();
      setCheckInResult({
        status: 'granted',
        title: 'ACCESO AUTORIZADO',
        message: `¡Bienvenido(a) ${found.firstName} ${found.lastName}! Membresía activa con ${found.subscription.daysRemaining} días disponibles.`,
        member: found,
      });
      setAccessLogs(prev => [{ name: `${found.firstName} ${found.lastName}`, doc, time: nowTime, status: 'granted' }, ...prev.slice(0, 9)]);
    }

    setCheckInDoc('');
  };

  // Guardar nuevo miembro
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMemberForm.documentNumber || !newMemberForm.firstName || !newMemberForm.lastName) {
      alert('Por favor complete los campos obligatorios: Cédula, Nombres y Apellidos.');
      return;
    }

    if (membersList.some((m) => m.documentNumber === newMemberForm.documentNumber)) {
      alert('Ya existe un miembro registrado con ese número de cédula.');
      return;
    }

    const today = new Date();
    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + newMemberForm.planDurationMonths);

    const planName = newMemberForm.planDurationMonths === 1 ? 'Mensualidad Estándar' : 'Plan Trimestral';
    const receiptId = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    const createdMember: MemberRecord = {
      id: `mem-${Date.now()}`,
      documentNumber: newMemberForm.documentNumber,
      documentType: newMemberForm.documentType,
      firstName: newMemberForm.firstName,
      lastName: newMemberForm.lastName,
      phone: newMemberForm.phone,
      email: newMemberForm.email,
      avatarUrl: newMemberForm.avatarUrl || PRESET_AVATARS[0].url,
      emergencyContactName: newMemberForm.emergencyContactName,
      emergencyContactPhone: newMemberForm.emergencyContactPhone,
      medicalNotes: newMemberForm.medicalNotes,
      status: 'active',
      createdAt: today.toISOString().slice(0, 10),
      subscription: {
        planName,
        amountPaidCOP: newMemberForm.planPriceCOP,
        startDate: today.toISOString().slice(0, 10),
        endDate: expiry.toISOString().slice(0, 10),
        status: 'active',
        daysRemaining: newMemberForm.planDurationMonths * 30,
        isFrozen: false,
        paymentMethod: newMemberForm.paymentMethod,
      },
    };

    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      memberName: `${newMemberForm.firstName} ${newMemberForm.lastName}`,
      documentNumber: newMemberForm.documentNumber,
      concept: planName,
      amountCOP: newMemberForm.planPriceCOP,
      paymentMethod: newMemberForm.paymentMethod,
    };

    setMembersList([createdMember, ...membersList]);
    setPaymentsLog([newPayment, ...paymentsLog]);
    setShowRegisterModal(false);

    triggerCelebration();

    setReceiptModalData({
      member: createdMember,
      concept: planName,
      amount: newMemberForm.planPriceCOP,
      paymentMethod: newMemberForm.paymentMethod,
      endDate: expiry.toISOString().slice(0, 10),
      receiptId,
    });

    setNewMemberForm({
      documentNumber: '',
      documentType: 'CC',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      avatarUrl: PRESET_AVATARS[0].url,
      emergencyContactName: '',
      emergencyContactPhone: '',
      medicalNotes: '',
      planDurationMonths: 1,
      planPriceCOP: 60000,
      paymentMethod: 'nequi',
    });
  };

  // Guardar Cambios de Edición de Miembro
  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setMembersList(prev => prev.map(m => (m.id === editingMember.id ? editingMember : m)));
    setEditingMember(null);
    triggerCelebration();
  };

  // Alternar Congelamiento de Membresía
  const handleToggleFreeze = (member: MemberRecord) => {
    if (!member.subscription) return;
    const isCurrentlyFrozen = !!member.subscription.isFrozen;

    const updatedSub = {
      ...member.subscription,
      isFrozen: !isCurrentlyFrozen,
      status: (!isCurrentlyFrozen ? 'frozen' : 'active') as any,
    };

    const updatedMember = {
      ...member,
      subscription: updatedSub,
    };

    setMembersList(prev => prev.map(m => (m.id === member.id ? updatedMember : m)));
    if (editingMember?.id === member.id) {
      setEditingMember(updatedMember);
    }
  };

  // Eliminar miembro
  const handleDeleteMember = (memberId: string) => {
    if (confirm('¿Estás seguro de eliminar este miembro del sistema? Esta acción no se puede deshacer.')) {
      setMembersList(prev => prev.filter(m => m.id !== memberId));
      setEditingMember(null);
    }
  };

  // Exportar Directorio a CSV para Excel
  const handleExportCSV = () => {
    const headers = ['Documento', 'Tipo', 'Nombres', 'Apellidos', 'Telefono', 'Correo', 'Estado', 'Plan', 'Vencimiento', 'Dias_Restantes'];
    const rows = membersList.map(m => [
      m.documentNumber,
      m.documentType,
      `"${m.firstName}"`,
      `"${m.lastName}"`,
      m.phone,
      m.email,
      m.status,
      `"${m.subscription?.planName || 'Sin Plan'}"`,
      m.subscription?.endDate || 'N/A',
      m.subscription?.daysRemaining || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `miembros_gym_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Renovar
  const handleRenewSubscription = (member: MemberRecord, method: 'cash' | 'nequi' | 'daviplata') => {
    const today = new Date();
    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + 1);
    const receiptId = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedMember: MemberRecord = {
      ...member,
      status: 'active',
      subscription: {
        planName: 'Mensualidad Estándar',
        amountPaidCOP: 60000,
        startDate: today.toISOString().slice(0, 10),
        endDate: expiry.toISOString().slice(0, 10),
        status: 'active',
        daysRemaining: 30,
        isFrozen: false,
        paymentMethod: method,
      },
    };

    setMembersList(prev => prev.map(m => (m.id === member.id ? updatedMember : m)));

    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      memberName: `${member.firstName} ${member.lastName}`,
      documentNumber: member.documentNumber,
      concept: 'Renovación Mensualidad Estándar',
      amountCOP: 60000,
      paymentMethod: method,
    };

    setPaymentsLog([newPayment, ...paymentsLog]);
    setShowRenewModal(null);
    triggerCelebration();

    setReceiptModalData({
      member: updatedMember,
      concept: 'Renovación Mensualidad Estándar (30 días)',
      amount: 60000,
      paymentMethod: method,
      endDate: expiry.toISOString().slice(0, 10),
      receiptId,
    });
  };

  // Venta Rápida de Tienda / Mostrador
  const handleConfirmProductSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellingProduct) return;

    const totalCOP = sellingProduct.priceCOP * sellQuantity;
    const newPayment: PaymentTransaction = {
      id: `pay-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      memberName: sellBuyerName || 'Cliente Mostrador',
      documentNumber: 'VENTA-TIENDA',
      concept: `Venta Mostrador: ${sellingProduct.name} (x${sellQuantity})`,
      amountCOP: totalCOP,
      paymentMethod: sellPaymentMethod,
    };

    setShopProducts(prev =>
      prev.map(p => (p.id === sellingProduct.id ? { ...p, stock: Math.max(0, p.stock - sellQuantity) } : p))
    );

    setPaymentsLog([newPayment, ...paymentsLog]);
    playAudioBeep('granted');
    triggerCelebration();

    setSellingProduct(null);
    setSellQuantity(1);
    setSellBuyerName('Cliente Mostrador');
  };

  const generateDigitalCardWhatsAppUrl = (member: MemberRecord) => {
    const phone = member.phone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('57') ? phone : `57${phone}`;

    const text = `¡Hola, ${member.firstName}! 🏋️\n\nAquí tienes tu *Carnet Digital Oficial de Socio VIP* en *Proyecto Gym*:\n\n👤 *Titular:* ${member.firstName} ${member.lastName}\n🆔 *Documento:* ${member.documentType} ${member.documentNumber}\n🎟️ *Plan:* ${member.subscription?.planName || 'Mensualidad'}\n📅 *Vigencia:* ${member.subscription?.endDate || 'Activa'}\n\nPresenta tu código en la recepción o escanea tu carnet en el kiosko para ingresar. ¡A romperla en el entrenamiento! 💪🔥`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const generateWhatsAppUrl = (data: NonNullable<typeof receiptModalData>) => {
    const phone = data.member.phone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('57') ? phone : `57${phone}`;

    const text = `¡Hola, ${data.member.firstName}! 👋\n\nTu pago de $${data.amount.toLocaleString('es-CO')} COP por concepto de *${data.concept}* ha sido registrado con éxito en *Proyecto Gym* (Comprobante #${data.receiptId}).\n\n📅 *Válido hasta:* ${data.endDate}\n💳 *Método de pago:* ${data.paymentMethod.toUpperCase()}\n\nRecuerda que para ingresar solo indicas tu documento *${data.member.documentNumber}* en recepción. ¡A entrenar con toda! 💪🏋️`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const metrics = useMemo(() => {
    const total = membersList.length;
    const active = membersList.filter(m => m.subscription?.status === 'active').length;
    const expiring = membersList.filter(m => m.subscription?.status === 'expiring_soon').length;
    const expired = membersList.filter(m => !m.subscription || m.subscription.status === 'expired' || m.status === 'banned').length;

    return { total, active, expiring, expired };
  }, [membersList]);

  const filteredMembers = useMemo(() => {
    return membersList.filter(m => {
      const matchesSearch =
        m.documentNumber.includes(searchTerm) ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.phone && m.phone.includes(searchTerm));

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return m.subscription?.status === 'active' && m.status === 'active';
      if (statusFilter === 'expiring_soon') return m.subscription?.status === 'expiring_soon';
      if (statusFilter === 'expired') return !m.subscription || m.subscription.status === 'expired' || m.status === 'banned';
      if (statusFilter === 'frozen') return !!m.subscription?.isFrozen;

      return true;
    });
  }, [membersList, searchTerm, statusFilter]);

  const countedNum = Number(actualCashCounted) || 0;
  const cashDiscrepancy = countedNum - cashSummary.expectedCashInDrawer;

  return (
    <div className="relative">
      {/* 0. PANTALLA DE CARGA */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-300">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center shadow-2xl shadow-emerald-500/20 animate-pulse">
              <Dumbbell className="w-10 h-10 text-emerald-400 animate-bounce" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-emerald-400/20 animate-ping opacity-30"></div>
          </div>

          <span className="text-xl font-extrabold tracking-tight text-white font-mono">
            PROYECTO GYM
          </span>
          <span className="text-xs text-zinc-400 mt-1 font-mono tracking-widest uppercase">
            Sistema Operativo de Alto Rendimiento
          </span>

          <div className="w-48 h-1.5 bg-zinc-800 rounded-full mt-6 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-emerald-400 mt-2 font-bold">{loadingProgress}%</span>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Header con Logo Gym Interactivo */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('members');
                triggerCelebration();
              }}
              title="Volver al inicio"
              className="group flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 transition cursor-pointer shadow-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-400 group-hover:bg-emerald-300 flex items-center justify-center text-zinc-950 font-bold transition shadow-md shadow-emerald-400/20">
                <Dumbbell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-sm tracking-tight text-white block group-hover:text-emerald-400 transition leading-none">
                  Proyecto Gym
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mt-1">
                  Recepción & Caja
                </span>
              </div>
            </button>

            <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800 rounded-lg">
              <button
                onClick={() => setActiveTab('members')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'members'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Miembros ({membersList.length})
              </button>

              <button
                onClick={() => setActiveTab('kiosk')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'kiosk'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Kiosko
              </button>

              <button
                onClick={() => setActiveTab('shop')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'shop'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                Tienda & POS
              </button>

              <button
                onClick={() => setActiveTab('finances')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                  activeTab === 'finances'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                Caja
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  ${cashSummary.totalRevenue.toLocaleString('es-CO')}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs rounded-xl flex items-center gap-2 transition cursor-pointer"
              title="Descargar lista de miembros en formato CSV para Excel"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-400/10 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Nuevo Miembro
            </button>
          </div>
        </div>

        {/* 2. KPIs Operativos con Efecto Tilt 3D */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <TiltCard className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between cursor-default">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">Total Registrados</span>
              <p className="text-2xl font-bold font-mono text-white mt-0.5">{metrics.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-zinc-800/80 flex items-center justify-center text-zinc-400">
              <Users className="w-5 h-5" />
            </div>
          </TiltCard>

          <TiltCard className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-500/20 flex items-center justify-between cursor-default shadow-lg shadow-emerald-500/5">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">Membresías Activas</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">{metrics.active}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </TiltCard>

          <TiltCard className="p-4 rounded-xl bg-zinc-900/80 border border-amber-500/20 flex items-center justify-between cursor-default shadow-lg shadow-amber-500/5">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">Por Vencer (&le; 3d)</span>
              <p className="text-2xl font-bold font-mono text-amber-400 mt-0.5">{metrics.expiring}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </TiltCard>

          <TiltCard className="p-4 rounded-xl bg-zinc-900/80 border border-rose-500/20 flex items-center justify-between cursor-default shadow-lg shadow-rose-500/5">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">Vencidas o Bloqueadas</span>
              <p className="text-2xl font-bold font-mono text-rose-400 mt-0.5">{metrics.expired}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
          </TiltCard>
        </div>

        {/* 3. VISTA A: DIRECTORIO DE MIEMBROS CON GESTIÓN INTEGRAL */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar por cédula, nombre o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <span className="text-zinc-500 text-[11px] flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filtrar:
                </span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    statusFilter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Todos ({metrics.total})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    statusFilter === 'active' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Activos ({metrics.active})
                </button>
                <button
                  onClick={() => setStatusFilter('expiring_soon')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    statusFilter === 'expiring_soon' ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Por Vencer ({metrics.expiring})
                </button>
                <button
                  onClick={() => setStatusFilter('expired')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    statusFilter === 'expired' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Vencidos ({metrics.expired})
                </button>
                <button
                  onClick={() => setStatusFilter('frozen')}
                  className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    statusFilter === 'frozen' ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Congelados
                </button>
              </div>
            </div>

            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Miembro</th>
                      <th className="py-3 px-4">Documento</th>
                      <th className="py-3 px-4">Plan Actual</th>
                      <th className="py-3 px-4">Vencimiento</th>
                      <th className="py-3 px-4">Días Restantes</th>
                      <th className="py-3 px-4">Métricas Físicas</th>
                      <th className="py-3 px-4 text-right">Gestión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 font-sans">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-zinc-500">
                          No se encontraron miembros con el criterio de búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member) => {
                        const sub = member.subscription;
                        const isFrozen = !!sub?.isFrozen;
                        const isExpired = !sub || sub.status === 'expired' || member.status === 'banned';
                        const isExpiring = sub?.status === 'expiring_soon';

                        return (
                          <tr key={member.id} className="hover:bg-zinc-800/30 transition group">
                            {/* Avatar y Nombre */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {member.avatarUrl ? (
                                  <img
                                    src={member.avatarUrl}
                                    alt={member.firstName}
                                    className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-emerald-400 transition"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-zinc-800 border border-white/10 flex items-center justify-center font-bold text-emerald-400 font-mono text-xs">
                                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <span className="font-semibold text-white block">
                                    {member.firstName} {member.lastName}
                                  </span>
                                  <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-zinc-500" />
                                    {member.phone || 'Sin teléfono'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 font-mono font-semibold text-zinc-300 whitespace-nowrap">
                              <span className="text-zinc-500 text-[10px] mr-1">{member.documentType}</span>
                              {member.documentNumber}
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-medium text-zinc-200">
                                {sub?.planName || 'Sin Plan'}
                              </span>
                              <span className="block text-[10px] text-zinc-500 font-mono">
                                ${(sub?.amountPaidCOP || 0).toLocaleString('es-CO')} COP
                              </span>
                            </td>

                            <td className="py-3 px-4 font-mono text-zinc-300">
                              {sub?.endDate || 'N/A'}
                            </td>

                            <td className="py-3 px-4">
                              {member.status === 'banned' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  SUSPENDIDO
                                </span>
                              ) : isFrozen ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                                  CONGELADA ({sub?.daysRemaining} d)
                                </span>
                              ) : isExpired ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  VENCIDA (0 d)
                                </span>
                              ) : isExpiring ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  {sub.daysRemaining} DÍAS RESTANTES
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  {sub?.daysRemaining} DÍAS (ACTIVA)
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              {member.bodyMetrics ? (
                                <div className="text-[11px] font-mono">
                                  <span className="text-white font-bold">{member.bodyMetrics.weightKg} kg</span>
                                  <span className="text-zinc-500 ml-1">({member.bodyMetrics.heightCm} cm)</span>
                                  <span className="block text-[10px] text-emerald-400 uppercase tracking-wider">
                                    {member.bodyMetrics.target}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-zinc-500 text-[11px] font-mono">Sin medidas</span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                              <button
                                onClick={() => setShowDigitalCard(member)}
                                className="px-2.5 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 text-emerald-400 border border-emerald-500/30 font-medium text-[11px] rounded-lg transition cursor-pointer"
                                title="Ver Carnet Digital Oficial con QR"
                              >
                                <QrCode className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                                Carnet VIP
                              </button>

                              <button
                                onClick={() => {
                                  setEditingMember({ ...member });
                                  setEditTab('info');
                                }}
                                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] rounded-lg transition cursor-pointer"
                                title="Editar datos completos y ficha"
                              >
                                <Edit3 className="w-3.5 h-3.5 inline mr-1 text-zinc-400" />
                                Ficha / Editar
                              </button>

                              <button
                                onClick={() => setShowRenewModal(member)}
                                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-400 hover:text-zinc-950 text-emerald-400 border border-emerald-500/20 font-bold text-[11px] rounded-lg transition cursor-pointer"
                              >
                                Cobrar ($60k)
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. VISTA B: KIOSKO */}
        {activeTab === 'kiosk' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <TiltCard className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                      Recepción en Vivo
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">Marcación Rápida por Cédula</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className={`px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 transition cursor-pointer border ${
                        audioEnabled
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                      }`}
                      title={audioEnabled ? 'Sonido activado' : 'Sonido silenciado'}
                    >
                      {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      <span>{audioEnabled ? 'Audio ON' : 'Silencio'}</span>
                    </button>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      En Línea
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCheckInSubmit} className="flex gap-3 mt-6">
                  <input
                    type="text"
                    placeholder="Número de Cédula..."
                    value={checkInDoc}
                    onChange={(e) => setCheckInDoc(e.target.value)}
                    className="flex-1 px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-xl font-mono text-white focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold rounded-xl text-sm transition cursor-pointer"
                  >
                    Marcar Entrada
                  </button>
                </form>

                <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span>Pruebas inmediatas:</span>
                  <button
                    type="button"
                    onClick={() => handleCheckInSubmit(undefined, '1020304050')}
                    className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition cursor-pointer"
                  >
                    Carlos (Activo)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckInSubmit(undefined, '1030405060')}
                    className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition cursor-pointer"
                  >
                    Andrea (Vence en 2d)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckInSubmit(undefined, '1040506070')}
                    className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition cursor-pointer"
                  >
                    Jorge (Suspendido)
                  </button>
                </div>

                {checkInResult && (
                  <div
                    className={`mt-6 p-5 rounded-xl border animate-in fade-in duration-200 ${
                      checkInResult.status === 'granted'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : checkInResult.status === 'warning'
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {checkInResult.member?.avatarUrl && (
                        <img
                          src={checkInResult.member.avatarUrl}
                          alt={checkInResult.member.firstName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 flex-shrink-0"
                        />
                      )}
                      {!checkInResult.member?.avatarUrl && checkInResult.status === 'granted' && (
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mt-0.5 flex-shrink-0" />
                      )}
                      {!checkInResult.member?.avatarUrl && checkInResult.status === 'warning' && (
                        <AlertTriangle className="w-10 h-10 text-amber-400 mt-0.5 flex-shrink-0" />
                      )}
                      {!checkInResult.member?.avatarUrl && checkInResult.status === 'denied' && (
                        <XCircle className="w-10 h-10 text-rose-400 mt-0.5 flex-shrink-0" />
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-base tracking-wide">{checkInResult.title}</h4>
                          {checkInResult.member?.subscription?.daysRemaining !== undefined && (
                            <span className="font-mono text-xs px-2.5 py-1 rounded bg-black/40 font-bold border border-white/10">
                              {checkInResult.member.subscription.daysRemaining} días restantes
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-1 opacity-90">{checkInResult.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TiltCard>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Entradas de Hoy
              </h4>
              <div className="space-y-2">
                {accessLogs.map((log, index) => (
                  <div key={index} className="p-2.5 rounded-lg bg-zinc-800/40 border border-zinc-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-white block">{log.name}</span>
                      <span className="text-[10px] font-mono text-zinc-400">CC {log.doc}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-400 block">{log.time}</span>
                      <span
                        className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          log.status === 'granted'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : log.status === 'warning'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4.5 VISTA: TIENDA & POS DE MOSTRADOR */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    Punto de Venta de Barra & Nevera
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Hidratación, Suplementos & Snacks</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Ventas rápidas de mostrador registradas automáticamente en el arqueo de caja diario (Nequi, Daviplata o Efectivo).
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {(['all', 'bebida', 'suplemento', 'snack', 'accesorio'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setShopCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                      shopCategoryFilter === cat
                        ? 'bg-emerald-400 text-zinc-950 font-bold'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {shopProducts
                .filter((p) => shopCategoryFilter === 'all' || p.category === shopCategoryFilter)
                .map((product) => (
                  <TiltCard
                    key={product.id}
                    className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/50 block">
                          {product.icon}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {product.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-white mt-3 group-hover:text-emerald-400 transition">
                        {product.name}
                      </h4>

                      <div className="flex items-baseline justify-between mt-2 font-mono">
                        <span className="text-lg font-extrabold text-emerald-400">
                          ${product.priceCOP.toLocaleString('es-CO')}
                          <span className="text-[10px] text-zinc-500 ml-1 font-sans">COP</span>
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Stock: <strong className={product.stock < 10 ? 'text-amber-400' : 'text-zinc-200'}>{product.stock}</strong> u
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSellingProduct(product);
                        setSellQuantity(1);
                        setSellBuyerName('Cliente Mostrador');
                      }}
                      disabled={product.stock <= 0}
                      className="mt-4 w-full py-2 bg-emerald-500/10 hover:bg-emerald-400 hover:text-zinc-950 text-emerald-400 border border-emerald-500/20 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {product.stock > 0 ? 'Venta Rápida' : 'Agotado'}
                    </button>
                  </TiltCard>
                ))}
            </div>
          </div>
        )}

        {/* 5. VISTA C: CAJA DIARIA */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${shiftClosed ? 'bg-zinc-500' : 'bg-emerald-400 animate-pulse'}`} />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                    {shiftClosed ? 'Turno Cerrado' : 'Caja Abierta — Turno Activo'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">Control de Caja y Flujo Diario</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Base en efectivo: <strong className="text-white font-mono">${initialCashBase.toLocaleString('es-CO')} COP</strong> · Registros de cobro en tiempo real.
                </p>
              </div>

              <button
                disabled={shiftClosed}
                onClick={() => setShowCashCloseModal(true)}
                className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-400/10"
              >
                <Coins className="w-4 h-4" />
                {shiftClosed ? 'Turno Finalizado' : 'Hacer Arqueo & Cerrar Caja'}
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <TiltCard className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Total Recaudado Hoy</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold font-mono text-white mt-3">
                  ${cashSummary.totalRevenue.toLocaleString('es-CO')} <span className="text-xs text-zinc-500 font-sans">COP</span>
                </p>
                <span className="text-[10px] text-zinc-500 mt-1">{paymentsLog.length} pagos registrados</span>
              </TiltCard>

              <TiltCard className="p-5 rounded-xl bg-zinc-900 border border-purple-500/20 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Nequi</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold">NEQUI</span>
                </div>
                <p className="text-2xl font-bold font-mono text-purple-300 mt-3">
                  ${cashSummary.nequi.toLocaleString('es-CO')} <span className="text-xs text-zinc-500 font-sans">COP</span>
                </p>
                <span className="text-[10px] text-zinc-500 mt-1">Sin comisiones</span>
              </TiltCard>

              <TiltCard className="p-5 rounded-xl bg-zinc-900 border border-rose-500/20 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Daviplata</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-mono font-bold">DAVIPLATA</span>
                </div>
                <p className="text-2xl font-bold font-mono text-rose-300 mt-3">
                  ${cashSummary.daviplata.toLocaleString('es-CO')} <span className="text-xs text-zinc-500 font-sans">COP</span>
                </p>
                <span className="text-[10px] text-zinc-500 mt-1">Directo a cuenta</span>
              </TiltCard>

              <TiltCard className="p-5 rounded-xl bg-zinc-900 border border-emerald-500/20 flex flex-col justify-between">
                <div className="flex items-center justify-between text-zinc-400 text-xs">
                  <span>Efectivo en Gaveta</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">EFECTIVO</span>
                </div>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-3">
                  ${cashSummary.expectedCashInDrawer.toLocaleString('es-CO')} <span className="text-xs text-zinc-500 font-sans">COP</span>
                </p>
                <span className="text-[10px] text-zinc-500 mt-1">Base ($50k) + Ventas (${cashSummary.cash.toLocaleString('es-CO')})</span>
              </TiltCard>
            </div>

            <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/60">
              <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  Libro Diario de Transacciones de Caja
                </h4>
                <span className="text-xs font-mono text-zinc-400">Total: {paymentsLog.length} movimientos</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/60 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Hora</th>
                      <th className="py-3 px-4">Miembro / Cédula</th>
                      <th className="py-3 px-4">Concepto</th>
                      <th className="py-3 px-4">Método de Pago</th>
                      <th className="py-3 px-4 text-right">Monto Recibido</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80 font-sans">
                    {paymentsLog.map((tx) => (
                      <tr key={tx.id} className="hover:bg-zinc-800/30 transition">
                        <td className="py-3 px-4 font-mono text-zinc-400">{tx.timestamp}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{tx.memberName}</span>
                          <span className="text-[11px] text-zinc-500 font-mono">C.C. {tx.documentNumber}</span>
                        </td>
                        <td className="py-3 px-4 text-zinc-300 font-medium">{tx.concept}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              tx.paymentMethod === 'nequi'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : tx.paymentMethod === 'daviplata'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : tx.paymentMethod === 'cash'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {tx.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white text-sm">
                          ${tx.amountCOP.toLocaleString('es-CO')} COP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: REGISTRO DE NUEVO MIEMBRO */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white">Registrar Nuevo Miembro</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-6">
                Ingresa los datos personales. Se enviará automáticamente el correo de confirmación y comprobante.
              </p>

              <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
                {/* Selector de Foto y Carga Local */}
                <div className="p-3 bg-zinc-800/40 rounded-xl border border-zinc-700/60">
                  <label className="block text-zinc-400 mb-1.5 font-medium">Foto de Perfil del Miembro</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={newMemberForm.avatarUrl || PRESET_AVATARS[0].url}
                      alt="Avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 flex-shrink-0 shadow-md"
                    />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="reg-avatar-upload"
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                        >
                          <Camera className="w-3.5 h-3.5 text-emerald-400" />
                          Subir Foto de tu PC
                        </label>
                        <input
                          id="reg-avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result) {
                                  setNewMemberForm({ ...newMemberForm, avatarUrl: ev.target.result as string });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="text-[10px] text-zinc-500">o elige:</span>
                      </div>

                      <div className="flex gap-1.5 overflow-x-auto py-1">
                        {PRESET_AVATARS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewMemberForm({ ...newMemberForm, avatarUrl: av.url })}
                            className={`w-7 h-7 rounded-full overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                              newMemberForm.avatarUrl === av.url ? 'border-emerald-400 scale-110 shadow-sm' : 'border-zinc-700 opacity-60 hover:opacity-100'
                            }`}
                            title={av.label}
                          >
                            <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Tipo Doc.</label>
                    <select
                      value={newMemberForm.documentType}
                      onChange={(e: any) => setNewMemberForm({ ...newMemberForm, documentType: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    >
                      <option value="CC">C.C.</option>
                      <option value="TI">T.I.</option>
                      <option value="CE">C.E.</option>
                      <option value="PASSPORT">Pasaporte</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-zinc-400 mb-1 font-medium">Número de Documento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 1020304050"
                      value={newMemberForm.documentNumber}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, documentNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Nombres *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Carlos"
                      value={newMemberForm.firstName}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Apellidos *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Mendoza"
                      value={newMemberForm.lastName}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 3001234567"
                      value={newMemberForm.phone}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Correo Electrónico (Verificación) *</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={newMemberForm.email}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Contacto de Emergencia</label>
                    <input
                      type="text"
                      placeholder="Nombre familiar"
                      value={newMemberForm.emergencyContactName}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, emergencyContactName: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Tel. Emergencia</label>
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={newMemberForm.emergencyContactPhone}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, emergencyContactPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Observaciones Médicas / Restricciones</label>
                  <textarea
                    rows={2}
                    placeholder="Lesiones, hipertensión, alergias o precauciones..."
                    value={newMemberForm.medicalNotes}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, medicalNotes: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <span className="block font-bold text-white mb-2">Cobro de Membresía Inicial (Ingreso a Caja)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">Plan</label>
                      <select
                        value={newMemberForm.planDurationMonths}
                        onChange={(e) => {
                          const months = Number(e.target.value);
                          setNewMemberForm({
                            ...newMemberForm,
                            planDurationMonths: months,
                            planPriceCOP: months === 1 ? 60000 : 160000,
                          });
                        }}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-medium"
                      >
                        <option value={1}>1 Mes — $60.000 COP</option>
                        <option value={3}>3 Meses — $160.000 COP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Método de Pago Recibido</label>
                      <select
                        value={newMemberForm.paymentMethod}
                        onChange={(e: any) => setNewMemberForm({ ...newMemberForm, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-medium"
                      >
                        <option value="nequi">Nequi</option>
                        <option value="daviplata">Daviplata</option>
                        <option value="cash">Efectivo</option>
                        <option value="transfer">Transferencia</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold rounded-lg cursor-pointer"
                  >
                    Guardar y Emitir Comprobante ($60.000 COP)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: GESTIÓN INTEGRAL Y EDICIÓN COMPLETA DEL MIEMBRO (NUEVO) */}
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setEditingMember(null)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
                {editingMember.avatarUrl ? (
                  <img
                    src={editingMember.avatarUrl}
                    alt={editingMember.firstName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono text-lg">
                    {editingMember.firstName.charAt(0)}{editingMember.lastName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingMember.firstName} {editingMember.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-zinc-400">
                      {editingMember.documentType} {editingMember.documentNumber}
                    </span>
                    <span className="text-zinc-600">·</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      editingMember.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {editingMember.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Pestañas de la Ficha del Miembro */}
              <div className="flex border-b border-zinc-800 gap-4 mt-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setEditTab('info')}
                  className={`pb-2 border-b-2 transition cursor-pointer ${
                    editTab === 'info' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Datos Personales
                </button>
                <button
                  type="button"
                  onClick={() => setEditTab('subscription')}
                  className={`pb-2 border-b-2 transition cursor-pointer ${
                    editTab === 'subscription' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Plan & Congelamiento
                </button>
                <button
                  type="button"
                  onClick={() => setEditTab('metrics')}
                  className={`pb-2 border-b-2 transition cursor-pointer ${
                    editTab === 'metrics' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                >
                  Ficha Antropométrica (IMC)
                </button>
              </div>

              <form onSubmit={handleUpdateMember} className="mt-5 space-y-4 text-xs">
                {/* Pestaña 1: Datos Personales */}
                {editTab === 'info' && (
                  <div className="space-y-4">
                    {/* Selector de Foto para Miembro en Edición */}
                    <div className="p-3 bg-zinc-800/40 rounded-xl border border-zinc-700/60">
                      <label className="block text-zinc-400 mb-1.5 font-medium">Foto del Miembro</label>
                      <div className="flex items-center gap-3">
                        {editingMember.avatarUrl ? (
                          <img
                            src={editingMember.avatarUrl}
                            alt="Avatar"
                            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 flex-shrink-0 shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-400 font-mono text-sm flex-shrink-0">
                            {editingMember.firstName.charAt(0)}{editingMember.lastName.charAt(0)}
                          </div>
                        )}

                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="edit-avatar-upload"
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                            >
                              <Camera className="w-3.5 h-3.5 text-emerald-400" />
                              Subir Nueva Foto de tu PC
                            </label>
                            <input
                              id="edit-avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    if (ev.target?.result) {
                                      setEditingMember({ ...editingMember, avatarUrl: ev.target.result as string });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <span className="text-[10px] text-zinc-500">o elige:</span>
                          </div>

                          <div className="flex gap-1.5 overflow-x-auto py-1">
                            {PRESET_AVATARS.map((av, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setEditingMember({ ...editingMember, avatarUrl: av.url })}
                                className={`w-7 h-7 rounded-full overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                                  editingMember.avatarUrl === av.url ? 'border-emerald-400 scale-110 shadow-sm' : 'border-zinc-700 opacity-60 hover:opacity-100'
                                }`}
                                title={av.label}
                              >
                                <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 mb-1">Nombres</label>
                        <input
                          type="text"
                          value={editingMember.firstName}
                          onChange={(e) => setEditingMember({ ...editingMember, firstName: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 mb-1">Apellidos</label>
                        <input
                          type="text"
                          value={editingMember.lastName}
                          onChange={(e) => setEditingMember({ ...editingMember, lastName: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 mb-1">Teléfono / WhatsApp</label>
                        <input
                          type="text"
                          value={editingMember.phone}
                          onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 mb-1">Correo Electrónico</label>
                        <input
                          type="email"
                          value={editingMember.email}
                          onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 mb-1">Contacto de Emergencia</label>
                        <input
                          type="text"
                          value={editingMember.emergencyContactName}
                          onChange={(e) => setEditingMember({ ...editingMember, emergencyContactName: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 mb-1">Teléfono Emergencia</label>
                        <input
                          type="text"
                          value={editingMember.emergencyContactPhone}
                          onChange={(e) => setEditingMember({ ...editingMember, emergencyContactPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Observaciones Médicas</label>
                      <textarea
                        rows={2}
                        value={editingMember.medicalNotes}
                        onChange={(e) => setEditingMember({ ...editingMember, medicalNotes: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Estado Administrativo del Miembro</label>
                      <select
                        value={editingMember.status}
                        onChange={(e: any) => setEditingMember({ ...editingMember, status: e.target.value })}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-medium"
                      >
                        <option value="active">Activo (Habilitado)</option>
                        <option value="inactive">Inactivo (No vigente)</option>
                        <option value="banned">Suspendido / Bloqueado (Prohibir Paso)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Pestaña 2: Plan y Congelamiento */}
                {editTab === 'subscription' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Plan Actual:</span>
                        <span className="font-bold text-white">{editingMember.subscription?.planName || 'Sin Plan'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Vence el:</span>
                        <span className="font-mono text-emerald-400 font-bold">{editingMember.subscription?.endDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Días Restantes:</span>
                        <span className="font-mono text-white font-bold">{editingMember.subscription?.daysRemaining || 0} días</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/60 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <PauseCircle className="w-4 h-4 text-blue-400" />
                          Congelamiento de Membresía
                        </h4>
                        <p className="text-zinc-400 text-[11px] mt-0.5">
                          Pausa el conteo de días si el usuario viaja o presenta incapacidad médica.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFreeze(editingMember)}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                          editingMember.subscription?.isFrozen
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {editingMember.subscription?.isFrozen ? (
                          <>
                            <PlayCircle className="w-4 h-4" /> Descongelar
                          </>
                        ) : (
                          <>
                            <PauseCircle className="w-4 h-4" /> Congelar Plan
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1">Ajustar Fecha de Vencimiento Manualmente</label>
                      <input
                        type="date"
                        value={editingMember.subscription?.endDate || ''}
                        onChange={(e) => {
                          if (!editingMember.subscription) return;
                          setEditingMember({
                            ...editingMember,
                            subscription: {
                              ...editingMember.subscription,
                              endDate: e.target.value,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Pestaña 3: Ficha Antropométrica */}
                {editTab === 'metrics' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 mb-1 font-medium">Peso Corporal (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Ej: 80.5"
                          value={editingMember.bodyMetrics?.weightKg || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setEditingMember({
                              ...editingMember,
                              bodyMetrics: {
                                weightKg: val,
                                heightCm: editingMember.bodyMetrics?.heightCm || 170,
                                bodyFatPct: editingMember.bodyMetrics?.bodyFatPct || 15,
                                target: editingMember.bodyMetrics?.target || 'hipertrofia',
                                updatedAt: new Date().toISOString().slice(0, 10),
                              },
                            });
                          }}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1 font-medium">Estatura (cm)</label>
                        <input
                          type="number"
                          placeholder="Ej: 175"
                          value={editingMember.bodyMetrics?.heightCm || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            setEditingMember({
                              ...editingMember,
                              bodyMetrics: {
                                weightKg: editingMember.bodyMetrics?.weightKg || 70,
                                heightCm: val,
                                bodyFatPct: editingMember.bodyMetrics?.bodyFatPct || 15,
                                target: editingMember.bodyMetrics?.target || 'hipertrofia',
                                updatedAt: new Date().toISOString().slice(0, 10),
                              },
                            });
                          }}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 mb-1 font-medium">% Grasa Corporal Estimado</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="Ej: 18.2"
                          value={editingMember.bodyMetrics?.bodyFatPct || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setEditingMember({
                              ...editingMember,
                              bodyMetrics: {
                                weightKg: editingMember.bodyMetrics?.weightKg || 70,
                                heightCm: editingMember.bodyMetrics?.heightCm || 170,
                                bodyFatPct: val,
                                target: editingMember.bodyMetrics?.target || 'hipertrofia',
                                updatedAt: new Date().toISOString().slice(0, 10),
                              },
                            });
                          }}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1 font-medium">Objetivo de Entrenamiento</label>
                        <select
                          value={editingMember.bodyMetrics?.target || 'hipertrofia'}
                          onChange={(e: any) => {
                            setEditingMember({
                              ...editingMember,
                              bodyMetrics: {
                                weightKg: editingMember.bodyMetrics?.weightKg || 70,
                                heightCm: editingMember.bodyMetrics?.heightCm || 170,
                                bodyFatPct: editingMember.bodyMetrics?.bodyFatPct || 15,
                                target: e.target.value,
                                updatedAt: new Date().toISOString().slice(0, 10),
                              },
                            });
                          }}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-medium"
                        >
                          <option value="hipertrofia">Hipertrofia (Masa Muscular)</option>
                          <option value="definicion">Definición / Pérdida de Grasa</option>
                          <option value="fuerza">Fuerza & Acondicionamiento</option>
                          <option value="salud">Salud General & Postura</option>
                        </select>
                      </div>
                    </div>

                    {/* Cálculo automático de IMC */}
                    {editingMember.bodyMetrics && editingMember.bodyMetrics.heightCm > 0 && editingMember.bodyMetrics.weightKg > 0 && (
                      <div className="p-3.5 rounded-xl bg-zinc-800/60 border border-zinc-700 flex items-center justify-between font-mono">
                        <span className="text-zinc-400">Índice de Masa Corporal (IMC):</span>
                        <span className="text-emerald-400 font-bold text-sm">
                          {(
                            editingMember.bodyMetrics.weightKg /
                            Math.pow(editingMember.bodyMetrics.heightCm / 100, 2)
                          ).toFixed(1)} kg/m²
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(editingMember.id)}
                    className="px-3.5 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar Miembro
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: RENOVAR MENSUALIDAD */}
        {showRenewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
              <button
                onClick={() => setShowRenewModal(null)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white">Renovar Mensualidad</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                Miembro: <strong className="text-white">{showRenewModal.firstName} {showRenewModal.lastName}</strong> (C.C. {showRenewModal.documentNumber})
              </p>

              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2 text-xs mb-5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Concepto:</span>
                  <span className="font-semibold text-white">Mensualidad Estándar (30 días)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total a Pagar:</span>
                  <span className="font-bold text-emerald-400 font-mono text-base">$ 60.000 COP</span>
                </div>
              </div>

              <span className="block text-xs font-semibold text-zinc-300 mb-2">Selecciona Método de Pago Recibido:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleRenewSubscription(showRenewModal, 'nequi')}
                  className="p-3 bg-zinc-800 hover:bg-purple-600 hover:text-white text-white rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span>Nequi</span>
                </button>
                <button
                  onClick={() => handleRenewSubscription(showRenewModal, 'daviplata')}
                  className="p-3 bg-zinc-800 hover:bg-rose-600 hover:text-white text-white rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span>Daviplata</span>
                </button>
                <button
                  onClick={() => handleRenewSubscription(showRenewModal, 'cash')}
                  className="p-3 bg-zinc-800 hover:bg-emerald-400 hover:text-zinc-950 text-white rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span>Efectivo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: ARQUEO Y CIERRE DE CAJA */}
        {showCashCloseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
              <button
                onClick={() => setShowCashCloseModal(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                Arqueo de Turno y Cierre de Caja
              </h3>
              <p className="text-xs text-zinc-400 mt-1 mb-5">
                Comprueba el efectivo real en gaveta contra los registros del sistema.
              </p>

              <div className="space-y-3 text-xs bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/60 mb-5 font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Base Inicial de Efectivo:</span>
                  <span className="text-white">${cashSummary.initialCashBase.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">+ Ventas en Efectivo del Turno:</span>
                  <span className="text-emerald-400 font-bold">+${cashSummary.cash.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="pt-2 border-t border-zinc-700 flex justify-between text-sm font-bold">
                  <span className="text-zinc-200">= Efectivo Esperado en Gaveta:</span>
                  <span className="text-emerald-400">${cashSummary.expectedCashInDrawer.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    ¿Cuánto dinero en efectivo físico contaste en la gaveta? (COP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm">$</span>
                    <input
                      type="number"
                      placeholder="Ej: 110000"
                      value={actualCashCounted}
                      onChange={(e) => setActualCashCounted(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-black/60 border border-zinc-700 rounded-lg text-white font-mono text-base focus:outline-none focus:border-emerald-500"
                      autoFocus
                    />
                  </div>
                </div>

                {actualCashCounted !== '' && (
                  <div
                    className={`p-3.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      cashDiscrepancy === 0
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : cashDiscrepancy > 0
                        ? 'bg-blue-950/40 border-blue-500/50 text-blue-300'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                    }`}
                  >
                    <span className="font-semibold">
                      {cashDiscrepancy === 0
                        ? '✓ Caja Cuadrada (0 Descuadres)'
                        : cashDiscrepancy > 0
                        ? `▲ Sobrante en Caja: +$${cashDiscrepancy.toLocaleString('es-CO')} COP`
                        : `▼ Faltante en Caja: -$${Math.abs(cashDiscrepancy).toLocaleString('es-CO')} COP`}
                    </span>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowCashCloseModal(false)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShiftClosed(true);
                      setShowCashCloseModal(false);
                      triggerCelebration();
                      alert(`✅ Turno cerrado con éxito. Total recaudado: $${cashSummary.totalRevenue.toLocaleString('es-CO')} COP.`);
                    }}
                    className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Confirmar Cierre de Turno
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: COMPROBANTE DIGITAL, CORREO Y WHATSAPP */}
        {receiptModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
              <button
                onClick={() => {
                  setReceiptModalData(null);
                  setShowEmailPreview(false);
                }}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Correo enviado a: <strong>{receiptModalData.member.email}</strong></span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowEmailPreview(!showEmailPreview)}
                  className="text-[11px] underline hover:text-white font-mono cursor-pointer ml-2 whitespace-nowrap"
                >
                  {showEmailPreview ? 'Ver Recibo' : 'Ver Correo'}
                </button>
              </div>

              {!showEmailPreview ? (
                <div>
                  <div className="p-6 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs space-y-4">
                    <div className="text-center pb-4 border-b border-zinc-800">
                      <span className="font-bold text-base text-white block">PROYECTO GYM</span>
                      <span className="text-[11px] text-zinc-400">Comprobante de Pago y Registro Oficial</span>
                      <span className="text-[10px] text-emerald-400 block mt-1">ID: {receiptModalData.receiptId}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Fecha y Hora:</span>
                        <span className="text-white">{new Date().toLocaleString('es-CO')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Titular:</span>
                        <span className="text-white font-bold">{receiptModalData.member.firstName} {receiptModalData.member.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Documento:</span>
                        <span className="text-white">{receiptModalData.member.documentType} {receiptModalData.member.documentNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Teléfono:</span>
                        <span className="text-white">{receiptModalData.member.phone}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-800 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Concepto:</span>
                        <span className="text-emerald-400 font-bold">{receiptModalData.concept}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Válido Hasta:</span>
                        <span className="text-white">{receiptModalData.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Método de Pago:</span>
                        <span className="text-white uppercase">{receiptModalData.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-zinc-800 font-bold">
                        <span className="text-zinc-200">TOTAL PAGADO:</span>
                        <span className="text-emerald-400 text-base">${receiptModalData.amount.toLocaleString('es-CO')} COP</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <a
                      href={generateWhatsAppUrl(receiptModalData)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Enviar a WhatsApp
                    </a>

                    <button
                      onClick={() => window.print()}
                      className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      Imprimir Recibo
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowDigitalCard(receiptModalData.member);
                      }}
                      className="py-3 px-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer col-span-2"
                    >
                      <QrCode className="w-4 h-4" />
                      Emitir & Ver Carnet Digital VIP del Miembro
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs max-h-[60vh] overflow-y-auto space-y-3">
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-zinc-300 font-mono text-[11px] space-y-1">
                    <p><strong>De:</strong> recepcion@proyectogym.com.co</p>
                    <p><strong>Para:</strong> {receiptModalData.member.email}</p>
                    <p><strong>Asunto:</strong> 🏋️ ¡Bienvenido(a) a Proyecto Gym, {receiptModalData.member.firstName}! Verificación de Membresía</p>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 space-y-3 leading-relaxed">
                    <p className="text-emerald-400 font-bold text-sm">PROYECTO GYM — Verificación de Datos</p>
                    <p>
                      Hola <strong>{receiptModalData.member.firstName}</strong>, tus datos han sido validados en nuestro sistema. A continuación encontrarás el resumen de tu suscripción:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-zinc-400 font-mono">
                      <li>Documento: {receiptModalData.member.documentNumber}</li>
                      <li>Plan: {receiptModalData.concept}</li>
                      <li>Vigencia: Hasta el {receiptModalData.endDate}</li>
                      <li>Valor: ${receiptModalData.amount.toLocaleString('es-CO')} COP ({receiptModalData.paymentMethod.toUpperCase()})</li>
                    </ul>
                    <p className="text-[11px] text-zinc-500">
                      Recuerda que para ingresar solo indicas tu número de documento en la terminal de recepción.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: CARNET DIGITAL DE MEMBRESÍA VIP */}
        {showDigitalCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
              <button
                onClick={() => setShowDigitalCard(null)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                  Credencial Digital NFC / QR
                </span>
                <h3 className="text-lg font-bold text-white">Carnet Oficial de Socio VIP</h3>
              </div>

              {/* Tarjeta Visual de Carnet */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-emerald-500/40 p-6 shadow-2xl shadow-emerald-500/10">
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Cabecera del Carnet */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-400 flex items-center justify-center text-zinc-950 font-bold text-xs shadow-md shadow-emerald-400/20">
                      🏋️
                    </div>
                    <div>
                      <span className="font-extrabold text-xs tracking-wider text-white uppercase block leading-none">
                        PROYECTO GYM
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                        SOCIO TITULAR VIP
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-6 rounded bg-gradient-to-r from-amber-400 to-amber-500 border border-amber-300 p-0.5 flex flex-col justify-between shadow-sm">
                    <div className="h-0.5 bg-amber-700/50 rounded-full" />
                    <div className="h-0.5 bg-amber-700/50 rounded-full" />
                  </div>
                </div>

                {/* Cuerpo del Carnet */}
                <div className="py-4 flex gap-4 items-center">
                  {showDigitalCard.avatarUrl ? (
                    <img
                      src={showDigitalCard.avatarUrl}
                      alt={showDigitalCard.firstName}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg shadow-emerald-400/20 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-zinc-800 border-2 border-emerald-400 flex items-center justify-center font-bold text-emerald-400 text-xl font-mono flex-shrink-0">
                      {showDigitalCard.firstName.charAt(0)}{showDigitalCard.lastName.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Miembro Acreditado</span>
                    <h4 className="text-base font-extrabold text-white truncate tracking-tight uppercase">
                      {showDigitalCard.firstName} {showDigitalCard.lastName}
                    </h4>
                    <p className="text-xs font-mono text-zinc-300 mt-0.5">
                      <span className="text-zinc-500 mr-1">{showDigitalCard.documentType}</span>
                      {showDigitalCard.documentNumber}
                    </p>

                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {showDigitalCard.subscription?.planName || 'Plan Estándar'}
                    </div>
                  </div>
                </div>

                {/* Código QR y Vigencia */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block">Vigencia hasta:</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {showDigitalCard.subscription?.endDate || 'Activa'}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 block mt-1">
                      GYM-COL-{showDigitalCard.documentNumber}
                    </span>
                  </div>

                  <div className="p-1 bg-white rounded-lg shadow-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(showDigitalCard.documentNumber)}&color=0-0-0&bgcolor=255-255-255`}
                      alt="QR Code"
                      className="w-16 h-16"
                    />
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-5 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={generateDigitalCardWhatsAppUrl(showDigitalCard)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Enviar WhatsApp
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir Carnet
                  </button>
                </div>

                <button
                  onClick={() => {
                    const doc = showDigitalCard.documentNumber;
                    setShowDigitalCard(null);
                    setActiveTab('kiosk');
                    handleCheckInSubmit(undefined, doc);
                  }}
                  className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/20 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  Simular Marcación en Kiosko con este Carnet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REGISTRAR VENTA DE TIENDA */}
        {sellingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
              <button
                onClick={() => setSellingProduct(null)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                Cobro de Mostrador
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                <span>{sellingProduct.icon}</span>
                {sellingProduct.name}
              </h3>

              <form onSubmit={handleConfirmProductSale} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Cantidad a Despachar</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                      className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-base flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-mono font-bold text-base text-white">
                      {sellQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSellQuantity(Math.min(sellingProduct.stock, sellQuantity + 1))}
                      className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-base flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-[11px] text-zinc-500 font-mono ml-2">
                      (Disponibles: {sellingProduct.stock})
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Nombre o Cliente</label>
                  <input
                    type="text"
                    value={sellBuyerName}
                    onChange={(e) => setSellBuyerName(e.target.value)}
                    placeholder="Cliente Mostrador o Nombre de Socio"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1.5">Método de Pago Recibido</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['nequi', 'daviplata', 'cash'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setSellPaymentMethod(method)}
                        className={`py-2 px-1 text-center font-bold text-[11px] rounded-lg uppercase transition cursor-pointer border ${
                          sellPaymentMethod === method
                            ? 'bg-emerald-400 text-zinc-950 border-emerald-400'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                        }`}
                      >
                        {method === 'cash' ? 'Efectivo' : method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 flex justify-between items-center font-mono">
                  <span className="text-zinc-400">Total a Cobrar:</span>
                  <span className="text-lg font-extrabold text-emerald-400">
                    ${(sellingProduct.priceCOP * sellQuantity).toLocaleString('es-CO')} COP
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setSellingProduct(null)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Cobrar & Despachar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
