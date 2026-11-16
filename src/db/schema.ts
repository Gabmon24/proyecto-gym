import { pgTable, uuid, varchar, text, integer, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums del Dominio
export const documentTypeEnum = pgEnum('document_type', ['CC', 'TI', 'CE', 'PASSPORT']);
export const memberStatusEnum = pgEnum('member_status', ['active', 'inactive', 'banned']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'expiring_soon', 'expired', 'frozen']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'nequi', 'daviplata', 'card', 'transfer']);
export const accessResultEnum = pgEnum('access_result', ['granted', 'warning_expiring', 'denied_expired', 'denied_inactive']);

// 1. Tabla de Miembros / Usuarios del Gimnasio
export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentNumber: varchar('document_number', { length: 20 }).notNull().unique(),
  documentType: documentTypeEnum('document_type').default('CC').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 150 }),
  emergencyContactName: varchar('emergency_contact_name', { length: 120 }),
  emergencyContactPhone: varchar('emergency_contact_phone', { length: 20 }),
  medicalNotes: text('medical_notes'),
  status: memberStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Tabla de Planes de Suscripción (en COP)
export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 80 }).notNull(), // Ej. "Mensualidad Estándar", "Trimestre", "Pase Diario"
  priceCOP: integer('price_cop').notNull(),         // Ej. 60000 ($60.000 COP)
  durationMonths: integer('duration_months').default(1).notNull(),
  durationDays: integer('duration_days').default(30).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Tabla de Suscripciones Activas e Históricas
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  planId: uuid('plan_id').references(() => plans.id).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  graceDays: integer('grace_days').default(0).notNull(), // Días de cortesía o compensación por festivos
  status: subscriptionStatusEnum('status').default('active').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(), // Nequi, Daviplata, Efectivo, etc.
  amountPaidCOP: integer('amount_paid_cop').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Registro de Control de Acceso / Asistencia (Check-in rápido en recepción)
export const accessLogs = pgTable('access_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  memberId: uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  accessResult: accessResultEnum('access_result').notNull(),
  message: text('message').notNull(), // Ej: "Acceso autorizado. Quedan 14 días de mensualidad."
});

// Relaciones Relacionales Drizzle
export const membersRelations = relations(members, ({ many }) => ({
  subscriptions: many(subscriptions),
  accessLogs: many(accessLogs),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  member: one(members, {
    fields: [subscriptions.memberId],
    references: [members.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
  accessLogs: many(accessLogs),
}));
