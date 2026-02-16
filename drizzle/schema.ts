import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  /** Username for local authentication (demo purposes) */
  username: varchar("username", { length: 255 }).unique(),
  /** Password hash for local authentication (demo purposes) */
  passwordHash: text("passwordHash"),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * MCC Institution table - represents each of the 12 institutions/units
 */
export const institutions = mysqlTable("institutions", {
  id: int("id").autoincrement().primaryKey(),
  institutionId: varchar("institutionId", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  owner: varchar("owner", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["Active", "Inactive", "Pending"]).default("Active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Institution = typeof institutions.$inferSelect;
export type InsertInstitution = typeof institutions.$inferInsert;

/**
 * Performance Variables - the 10-12 metrics tracked per institution
 */
export const performanceVariables = mysqlTable("performanceVariables", {
  id: int("id").autoincrement().primaryKey(),
  variableId: varchar("variableId", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  unit: varchar("unit", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PerformanceVariable = typeof performanceVariables.$inferSelect;
export type InsertPerformanceVariable = typeof performanceVariables.$inferInsert;

/**
 * Monthly Performance Data - time-phased tracking for each institution/variable combination
 */
export const performanceData = mysqlTable("performanceData", {
  id: int("id").autoincrement().primaryKey(),
  institutionId: int("institutionId").notNull(),
  variableId: int("variableId").notNull(),
  month: varchar("month", { length: 20 }).notNull(),
  year: int("year").notNull(),
  baselineValue: text("baselineValue"),
  actualValue: text("actualValue"),
  status: mysqlEnum("status", ["Green", "Yellow", "Red"]).notNull(),
  notes: text("notes"),
  submittedBy: int("submittedBy"),
  submittedAt: timestamp("submittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PerformanceRecord = typeof performanceData.$inferSelect;
export type InsertPerformanceRecord = typeof performanceData.$inferInsert;

/**
 * Permissions - granular access control definitions
 */
export const permissions = mysqlTable("permissions", {
  id: int("id").autoincrement().primaryKey(),
  permissionId: varchar("permissionId", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

/**
 * User Roles - role definitions
 */
export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

/**
 * Role-Permission Mappings - which permissions each role has
 */
export const rolePermissions = mysqlTable("rolePermissions", {
  id: int("id").autoincrement().primaryKey(),
  roleId: int("roleId").notNull(),
  permissionId: int("permissionId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;

/**
 * User-Institution Assignments - maps users to institutions with specific roles
 */
export const userInstitutionAssignments = mysqlTable("userInstitutionAssignments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  institutionId: int("institutionId").notNull(),
  roleId: int("roleId").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserInstitutionAssignment = typeof userInstitutionAssignments.$inferSelect;
export type InsertUserInstitutionAssignment = typeof userInstitutionAssignments.$inferInsert;

/**
 * Audit Log - tracks all changes for compliance and governance
 */
export const auditLog = mysqlTable("auditLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: int("entityId"),
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type InsertAuditLogEntry = typeof auditLog.$inferInsert;
