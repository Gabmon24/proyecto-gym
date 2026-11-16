# 🏋️ Proyecto Gym — Sistema Integral de Gestión y Control de Gimnasios

Sistema operativo integral y de alto rendimiento diseñado específicamente para la operación real de gimnasios en **Colombia**: tarifas en COP, planes de $60.000 COP, pagos por **Nequi**, **Daviplata** y **Efectivo**, carnet digital con código QR dinámico, punto de venta de barra (POS hidratación y suplementos), kiosko con audio-feedback, arqueo de caja y motor de festivos nacionales (Ley Emiliani).

Desarrollado bajo principios de **Clean Architecture**, separación estricta frontend/backend y estándares de ingeniería de software para portafolio profesional.

---

## ⚡ Características Principales

### 1. 👥 Gestión Integral de Miembros
- **Directorio de Socios:** Búsqueda en tiempo real por nombre, cédula o teléfono, con filtros por estado (*Activo, Por Vencer, Vencido, Congelado*).
- **Ficha y Edición Completa:** Modificación de nombres, teléfonos/WhatsApp, correos, contactos de emergencia y notas médicas.
- **Cambio de Planes & Congelamiento:** Permite cambiar el plan en caliente o congelar temporalmente la membresía (viajes/incapacidades médicas) recalculando automáticamente los días restantes.
- **Ficha Antropométrica & Salud:** Registro de peso corporal (kg), estatura (cm), grasa estimada y objetivo fitness (*Hipertrofia, Definición, Fuerza, Salud*), con **cálculo reactivo automático del IMC**.
- **Gestión de Fotos:** Selección de avatares predeterminados en alta resolución o carga de fotos directamente desde el computador (DataURL / Base64 nativo).
- **Exportación CSV:** Descarga con un clic de toda la base de datos de socios compatible con Excel.

### 2. 🎟️ Carnet Digital Oficial de Socio VIP
- Credencial virtual con estética futurista de alta gama (*Apple Wallet* / Pass VIP).
- Foto del socio, chip de seguridad metálico, nombre, número de documento y fecha de vigencia.
- **Código QR dinámico** generado para control de acceso rápido.
- Botones de acción directa: **Enviar por WhatsApp**, **Imprimir Credencial** y **Simular Marcación en Kiosko**.

### 3. ⏱️ Kiosko de Recepción con Audio-Feedback
- Marcación rápida por cédula con semáforo de estado:
  - 🟢 **Acceso Autorizado:** Miembro con mensualidad al día.
  - 🟡 **Advertencia:** Miembro próximo a vencer (últimos días).
  - 🔴 **Acceso Denegado:** Mensualidad vencida, membresía congelada o usuario suspendido.
- **Audio-Feedback Físico:** Sintetizador web nativo (**Web Audio API**) que emite tonos estilo torniquete (*Beep agudo* en acceso permitido, *Alerta grave* en vencido) con botón de silenciar.

### 4. 🛒 Tienda & POS de Mostrador (Nevera & Suplementos)
- Catálogo de venta rápida para recepción:
  - 💧 Agua Cristal 600ml ($2.000 COP)
  - ⚡ Gatorade Frutas 500ml ($4.500 COP)
  - 🔋 Speed Max 250ml ($2.500 COP)
  - 🐂 Red Bull Energy ($7.000 COP)
  - 🥤 Scoop de Proteína Whey Isolate ($6.000 COP)
  - 💪 Scoop de Creatina Monohidrato ($4.000 COP)
  - 🍫 Barras Proteicas Tosh Fit ($3.500 COP)
- Registro de ventas en 1-clic vinculadas al socio o "Cliente Mostrador".
- **Integración automática en el Arqueo de Caja** del turno actual.

### 5. 💰 Caja Diaria & Arqueo de Turno
- Consolidación financiera en tiempo real: desglose exacto de ingresos por **Nequi**, **Daviplata**, **Efectivo** y transferencias.
- Arqueo de gaveta: comprobación física contra base inicial ($50.000 COP) y detección automática de sobrantes o faltantes.
- Libro diario de transacciones con hora y concepto.

### 6. 🇨🇴 Motor de Festivos de Colombia (Ley Emiliani)
- Algoritmo astronómico de Butcher-Meeus para el cálculo de Semana Santa y festivos móviles trasladados al lunes siguiente según la Ley 51 de 1983.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
| :--- | :--- |
| **Frontend** | Astro 5, React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **Backend** | Hono (Node.js), TypeScript estricto, Zod (validación fail-fast) |
| **Base de Datos** | PostgreSQL, Drizzle ORM (preparado para pooling y migraciones) |
| **Testing** | Vitest (19 pruebas unitarias de lógica pura y servicios) |
| **Audio & Web APIs** | Web Audio API (synth nativo), FileReader API, Print CSS |

---

## 📁 Estructura del Repositorio

```
proyecto-gym/
├── client/                               # Frontend Web (Astro 5 + React 19)
│   ├── src/
│   │   ├── components/
│   │   │   └── GymDashboard.tsx          # Consola ejecutiva unificada del gimnasio
│   │   ├── layouts/
│   │   │   └── Layout.astro              # Layout base con cabecera y metadatos SEO
│   │   ├── pages/
│   │   │   └── index.astro               # Isla interactiva principal
│   │   └── styles/
│   │       └── global.css                # Tailwind v4 con tokens de color
│   ├── astro.config.mjs
│   └── package.json
│
├── src/                                  # Backend API & Servicios de Dominio
│   ├── config/
│   │   └── env.ts                        # Variables de entorno validadas con Zod
│   ├── db/
│   │   ├── schema.ts                     # Modelos relacionales Drizzle ORM
│   │   ├── seed.ts                       # Semilla de datos iniciales
│   │   └── index.ts                      # Pool de conexión a PostgreSQL
│   ├── routes/                           # Controladores de rutas HTTP (Hono)
│   │   ├── member.routes.ts
│   │   ├── subscription.routes.ts
│   │   └── access.routes.ts
│   ├── services/                         # Lógica pura de negocio
│   │   ├── membership.service.ts
│   │   ├── cash-register.service.ts
│   │   ├── colombian-holidays.service.ts
│   │   ├── email.service.ts
│   │   └── __tests__/                    # Tests unitarios con Vitest (100% passing)
│   └── index.ts                          # Servidor principal Hono
│
├── drizzle.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🚀 Puesta en Marcha Local

### Prerrequisitos
- Node.js >= 20.x
- npm >= 10.x

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/proyecto-gym.git
cd proyecto-gym
```

### 2. Iniciar el Frontend (Panel del Gimnasio)
```bash
cd client
npm install
npm run dev
```
> Abrir en el navegador: `http://localhost:5173`

### 3. Ejecutar Pruebas Unitarias del Backend
```bash
# Desde la raíz de proyecto-gym:
npm install
npm test
```

---

## 👨‍💻 Autor

Desarrollado por **Gabriel** ([@Gabmon24](https://github.com/Gabmon24))
- Licenciado en Informática
- Tecnólogo en Análisis y Desarrollo de Software (ADSO)
- Colombia 🇨🇴
