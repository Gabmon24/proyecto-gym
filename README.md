# 🏋️ Proyecto Gym — Sistema Integral de Gestión y Control de Gimnasios

<div align="center">

![Vitest Tests](https://img.shields.io/badge/Unit_Tests-19_Passing_(100%25)-10b981?style=for-the-badge&logo=vitest&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict_ESNext-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Clean_/_Decoupled-f59e0b?style=for-the-badge)
![Astro & React](https://img.shields.io/badge/Frontend-Astro_5_+_React_19-BC52EE?style=for-the-badge&logo=astro&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS_v4_OKLCH-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Colombia](https://img.shields.io/badge/Context-Colombia_COP_(%2460k)-FFD700?style=for-the-badge)

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_VER_DEMO_EN_VIVO-Vercel_Cloud-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://proyecto-6bxqv16ow-gabmon24.vercel.app)

<p align="center">
  <strong>Sistema operativo de alto rendimiento diseñado para la economía y operación real de gimnasios en Colombia.</strong><br>
  Tarifas estándar en COP ($60.000/mes) · Pagos por Nequi, Daviplata y Efectivo · Carnet Digital QR · Kiosko con Audio-Feedback · Arqueo de Caja diario · Motor de Festivos (Ley Emiliani).
</p>

</div>

---

## 💡 ¿Por qué este proyecto demuestra entendimiento del Negocio Real?

La mayoría de proyectos junior son clones superficiales sin reglas de negocio. **Proyecto Gym** fue diseñado resolviendo los dolores operativos reales que sufren los dueños y administradores de gimnasios en Colombia:

```mermaid
flowchart TD
    subgraph Negocio["Operación Real del Gimnasio"]
        A["Socio llega a Recepción"] --> B{"Control de Acceso Kiosko"}
        B -->|Membresía Activa| C["🟢 Paso Permitido + Chime Sonoro"]
        B -->|Por Vencer| D["🟡 Advertencia + Recordatorio de Pago"]
        B -->|Vencida / Congelada| E["🔴 Acceso Denegado + Alerta Grave"]
        
        F["Cobro de Mensualidad o POS"] --> G{"Método de Pago Local"}
        G -->|Nequi / Daviplata| H["Comprobante WhatsApp Directo + QR"]
        G -->|Efectivo| I["Registro en Gaveta de Caja"]
        
        I --> J["Arqueo de Turno: Base ($50k) vs Físico Contado"]
        J --> K["Cálculo Automático de Faltante / Sobrante"]
    end
```

1. **Economía Real en Pesos Colombianos (COP):** Tarifas de mercado estándar en Colombia ($60.000 COP mensualidad, $160.000 COP trimestral, $10.000 COP pase diario).
2. **Pagos Locales & Arqueo de Caja:** En Colombia, el 80% de los pagos en gimnasios no pasan por datáfono tradicional, sino por transferencias móviles (**Nequi / Daviplata**) o efectivo físico. El sistema consolida cada método y realiza el arqueo de turno contra la base inicial, detectando descuadres al centavo.
3. **Punto de Venta de Barra (Nevera & Suplementos):** Venta rápida en 1-clic de hidratación (Aguas, Gatorade, Speed Max) y suplementación deportiva (scoops de proteína/creatina), sumándose de inmediato al saldo de caja del turno.
4. **Carnet Digital de Socio VIP con QR:** Credencial virtual estilo *Apple Wallet* con foto, vigencia y código QR dinámico que los socios pueden llevar en su teléfono o recibir por WhatsApp para agilizar el ingreso.
5. **Motor de Festivos Nacionales (Ley Emiliani):** Colombia es uno de los países con más días feriados del mundo (18 días). El backend implementa el algoritmo astronómico de Meeus para calcular Semana Santa y trasladar festivos a los lunes según la Ley 51 de 1983, permitiendo compensaciones justas a los socios.
6. **Audio-Feedback Nativo (Web Audio API):** El kiosko reproduce tonos físicos de torniquete sintetizados en el navegador (agudo de confirmación o alerta grave de vencimiento) sin librerías externas ni archivos de audio pesados.

---

## 🏛️ Arquitectura de Software Limpia (Clean Architecture)

El proyecto mantiene una estricta separación de responsabilidades, dividiendo el dominio del negocio, la persistencia y la interfaz de usuario:

```mermaid
graph TD
    subgraph Frontend["Frontend Client (Astro 5 + React 19)"]
        UI["GymDashboard (Isla React Interactiva)"]
        Components["Kiosko · Directorio · POS Tienda · Arqueo"]
        Audio["Web Audio API Synth"]
    end

    subgraph Backend["Backend API (Hono + TypeScript)"]
        Routes["Controladores HTTP / Rutas (/api/members, /api/access)"]
        Services["Servicios Puros de Dominio"]
        Tests["19 Pruebas Unitarias Vitest"]
    end

    subgraph Data["Persistencia & Modelado"]
        Drizzle["Drizzle ORM (Esquemas Relacionales Tipados)"]
        DB[(PostgreSQL / Pooling)]
    end

    UI --> Routes
    Routes --> Services
    Services --> Drizzle
    Drizzle --> DB
    Services -.-> Tests
```

---

## 🧪 Pruebas Unitarias Automatizadas (Vitest)

El corazón de la lógica de negocio cuenta con una suite completa de pruebas unitarias que validan estados de membresía, cálculos financieros y auditoría de notificaciones:

```bash
$ npm test

 ✓ src/services/__tests__/cash-register.service.test.ts (4 tests) 16ms
 ✓ src/services/__tests__/email.service.test.ts (3 tests) 17ms
 ✓ src/services/__tests__/membership.service.test.ts (12 tests) 19ms

 Test Files  3 passed (3)
      Tests  19 passed (19)
   Duration  648ms (100% Passing)
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías | Propósito |
| :--- | :--- | :--- |
| **Frontend UI** | Astro 5, React 19, Tailwind CSS v4 | Interfaz ultra reactiva con renderizado de islas y tokens de color OKLCH |
| **Backend API** | Hono sobre Node.js, TypeScript estricto | Servidor ligero, veloz y completamente tipado de extremo a extremo |
| **Persistencia** | PostgreSQL con Drizzle ORM | Consultas parametrizadas seguras contra inyección SQL y migraciones controladas |
| **Validación** | Zod | Validación fail-fast de variables de entorno y DTOs de entrada |
| **Testing** | Vitest | Pruebas unitarias de ejecución instantánea (<700ms) |
| **Hardware / Web** | Web Audio API, FileReader API | Sonidos de torniquete nativos y procesamiento de avatares en cliente |

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
│   │       └── global.css                # Tailwind v4 con tokens de color OKLCH
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
git clone https://github.com/Gabmon24/proyecto-gym.git
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

Desarrollado con orgullo por **Gabriel Montiel** ([@Gabmon24](https://github.com/Gabmon24))
- 🎓 **Licenciado en Informática**
- 🚀 **Tecnólogo en Análisis y Desarrollo de Software (ADSO - SENA)**
- 📍 Colombia 🇨🇴 · *Open to Remote Software Engineering Roles*
