import { pgTable, text, timestamp, uuid, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'staff', 'technician']);
export const statusEnum = pgEnum('status', ['pending', 'verified', 'in_progress', 'resolved', 'closed']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: text('role', { enum: ['admin', 'staff', 'technician'] }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const complaints = pgTable('complaints', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientName: varchar('patient_name', { length: 255 }),
  whatsapp: varchar('whatsapp', { length: 20 }).notNull(),
  unit: varchar('unit', { length: 100 }).notNull(), // Poli, Farmasi, Kasir, Ranap
  content: text('content').notNull(),
  status: text('status', { enum: ['pending', 'verified', 'in_progress', 'resolved', 'closed'] }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dispositions = pgTable('dispositions', {
  id: uuid('id').defaultRandom().primaryKey(),
  complaintId: uuid('complaint_id').references(() => complaints.id).notNull(),
  targetUnit: varchar('target_unit', { length: 100 }).notNull(),
  adminNotes: text('admin_notes'),
  adminId: uuid('admin_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  complaintId: uuid('complaint_id').references(() => complaints.id).notNull(),
  action: text('action').notNull(), // Patient Submitted, Admin Verified, Technician Responded, etc.
  actorId: uuid('actor_id').references(() => users.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
