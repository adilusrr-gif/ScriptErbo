import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core"

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  vehicleType: text("vehicle_type").notNull().default(""),
  model: text("model").notNull().default(""),
  year: integer("year"),
  pr: text("pr").notNull().default(""),
  vin: text("vin").notNull().default(""),
  fullVin: text("full_vin").notNull().default(""),
  sbkts: text("sbkts").notNull().default(""),
  customsCleared: text("customs_cleared").notNull().default(""),
  recyclingFee: text("recycling_fee").notNull().default(""),
  epts: text("epts").notNull().default(""),
  trafficRegistration: text("traffic_registration").notNull().default(""),
  company: text("company").notNull().default(""),
  status: text("status").notNull().default(""),
  manager: text("manager").notNull().default(""),
  statusSecondary: text("status_secondary").notNull().default(""),
  managerSecondary: text("manager_secondary").notNull().default(""),
  bookingDate: text("booking_date").notNull().default(""),
  buyerCompany: text("buyer_company").notNull().default(""),
  contract: text("contract").notNull().default(""),
  paymentStatus: text("payment_status").notNull().default(""),
  paymentDate: text("payment_date").notNull().default(""),
  location: text("location").notNull().default(""),
  arrivalDateLegacy: text("arrival_date_legacy").notNull().default(""),
  dkpContract: text("dkp_contract").notNull().default(""),
  currentState: text("current_state").notNull().default(""),
  departureDate: text("departure_date").notNull().default(""),
  note: text("note").notNull().default(""),
  arrivalDate: text("arrival_date").notNull().default(""),
  app: text("app").notNull().default(""),
  rjv: text("rjv").notNull().default(""),
  months: text("months").notNull().default(""),
  delivery: text("delivery").notNull().default(""),
  carrier: text("carrier").notNull().default(""),
  route: text("route").notNull().default(""),
  yearSecondary: integer("year_secondary"),
  /** Заменяет концепцию "скрыт фильтром/вручную" из Google Sheets — такие
   *  записи не попадают в обычные списки/статистику, но не удаляются. */
  archived: boolean("archived").notNull().default(false),
  /** Срок брони в днях, указанный при бронировании, и посчитанный сервером
   *  момент истечения — после него /api/cron/expire-bookings сбрасывает бронь. */
  bookingDays: integer("booking_days"),
  bookingExpiresAt: timestamp("booking_expires_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
})

export type VehicleRow = typeof vehicles.$inferSelect
export type NewVehicleRow = typeof vehicles.$inferInsert

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  /** Должно совпадать с тем, как имя менеджера записано в vehicles.manager
   *  — по нему ограничивается видимость записей для роли manager. */
  name: text("name").notNull(),
  role: text("role", { enum: ["owner", "manager"] }).notNull().default("manager"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type UserRow = typeof users.$inferSelect
export type NewUserRow = typeof users.$inferInsert

/** Журнал действий: кто/когда/что изменил — основа для "активность за 24ч" на Dashboard. */
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  userName: text("user_name").notNull(),
  userRole: text("user_role").notNull(),
  vehicleId: integer("vehicle_id"),
  action: text("action", { enum: ["create", "update", "delete"] }).notNull(),
  summary: text("summary").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type ActivityLogRow = typeof activityLog.$inferSelect
export type NewActivityLogRow = typeof activityLog.$inferInsert
