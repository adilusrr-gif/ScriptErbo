import { and, desc, eq, ilike, isNotNull, lt, notIlike, or, sql, type SQL } from "drizzle-orm"

import { db } from "@/lib/db"
import { vehicles, type VehicleRow } from "@/lib/db/schema"
import { ActivityQueries } from "@/lib/db/activity-queries"
import type { Role } from "@/lib/auth/session"
import type {
  DashboardStats,
  Vehicle,
  VehicleFilterParams,
  VehicleInput,
} from "@/types/vehicle"

export interface AuthContext {
  role: Role
  /** Имя менеджера — должно совпадать с vehicles.manager для своих записей. */
  name: string
  userId: number | null
}

const STATUS_AFTER_EXPIRY = "Доступен для продажи"

function bookingFieldsFromInput(input: Partial<VehicleInput>) {
  const values: Record<string, unknown> = {}
  if ("bookingDays" in input) {
    const days = (input as Partial<VehicleInput> & { bookingDays?: number | null }).bookingDays
    if (days && days > 0) {
      values.bookingDays = days
      values.bookingExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    } else {
      values.bookingDays = null
      values.bookingExpiresAt = null
    }
  }
  return values
}

function toVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    vehicleType: row.vehicleType,
    model: row.model,
    year: row.year,
    pr: row.pr,
    vin: row.vin,
    fullVin: row.fullVin,
    sbkts: row.sbkts,
    customsCleared: row.customsCleared,
    recyclingFee: row.recyclingFee,
    epts: row.epts,
    trafficRegistration: row.trafficRegistration,
    company: row.company,
    status: row.status,
    manager: row.manager,
    statusSecondary: row.statusSecondary,
    managerSecondary: row.managerSecondary,
    bookingDate: row.bookingDate,
    buyerCompany: row.buyerCompany,
    contract: row.contract,
    paymentStatus: row.paymentStatus,
    paymentDate: row.paymentDate,
    location: row.location,
    arrivalDateLegacy: row.arrivalDateLegacy,
    dkpContract: row.dkpContract,
    currentState: row.currentState,
    departureDate: row.departureDate,
    note: row.note,
    arrivalDate: row.arrivalDate,
    app: row.app,
    rjv: row.rjv,
    months: row.months,
    delivery: row.delivery,
    carrier: row.carrier,
    route: row.route,
    yearSecondary: row.yearSecondary,
    bookingDays: row.bookingDays,
    bookingExpiresAt: row.bookingExpiresAt ? row.bookingExpiresAt.toISOString() : "",
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : "",
  }
}

function toInsertValues(input: Partial<VehicleInput>) {
  const values: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) values[key] = value
  }
  return values
}

/**
 * Видимость для роли manager: свои записи (manager = их имя) ИЛИ свободная
 * техника, ещё не забронированная никем (manager пуст и статус не "брон") —
 * чтобы можно было выбрать технику для новой брони, не видя чужие брони.
 * Для owner ограничений нет (возвращает null).
 */
function visibilityCondition(ctx: AuthContext): SQL | undefined {
  if (ctx.role === "owner") return undefined
  return or(
    // trim с двух сторон — в данных встречаются лишние пробелы вокруг имени
    sql`lower(trim(${vehicles.manager})) = lower(${ctx.name.trim()})`,
    and(eq(sql<string>`trim(${vehicles.manager})`, ""), notIlike(vehicles.status, "%брон%"))
  )
}

export const VehicleQueries = {
  async getAll(ctx: AuthContext): Promise<Vehicle[]> {
    const scope = visibilityCondition(ctx)
    const rows = await db
      .select()
      .from(vehicles)
      .where(scope ? and(eq(vehicles.archived, false), scope) : eq(vehicles.archived, false))
      .orderBy(vehicles.id)
    return rows.map(toVehicle)
  },

  async getById(id: number, ctx: AuthContext): Promise<Vehicle> {
    if (ctx.role === "owner") {
      const [row] = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1)
      if (!row) throw new Error(`Техника с id=${id} не найдена`)
      return toVehicle(row)
    }
    const visible = await this.getAll(ctx)
    const vehicle = visible.find((v) => v.id === id)
    if (!vehicle) throw new Error(`Техника с id=${id} не найдена`)
    return vehicle
  },

  async create(input: VehicleInput, ctx: AuthContext): Promise<Vehicle> {
    const [row] = await db
      .insert(vehicles)
      .values({
        ...toInsertValues(input),
        ...bookingFieldsFromInput(input),
        updatedAt: new Date(),
      })
      .returning()
    await ActivityQueries.log(ctx, {
      vehicleId: row.id,
      action: "create",
      summary: `Добавлена техника: ${row.vehicleType} ${row.model}`.trim(),
    })
    return toVehicle(row)
  },

  async update(id: number, input: Partial<VehicleInput>, ctx: AuthContext): Promise<Vehicle> {
    // Manager должен сначала видеть запись (своя или свободная), иначе — не найдена.
    await this.getById(id, ctx)

    const values = toInsertValues(input)
    delete values.id
    Object.assign(values, bookingFieldsFromInput(input))

    if (ctx.role === "manager") {
      // Менеджер не может присвоить технику другому менеджеру или снять
      // с себя — поле manager всегда принудительно его собственное имя.
      values.manager = ctx.name
    }

    const [row] = await db
      .update(vehicles)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning()
    if (!row) throw new Error(`Техника с id=${id} не найдена`)

    const changedFields = Object.keys(values).join(", ")
    await ActivityQueries.log(ctx, {
      vehicleId: row.id,
      action: "update",
      summary: changedFields ? `Изменены поля: ${changedFields}` : "Обновление",
    })
    return toVehicle(row)
  },

  async remove(id: number, ctx: AuthContext): Promise<{ id: number }> {
    const [row] = await db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning({ id: vehicles.id, vehicleType: vehicles.vehicleType, model: vehicles.model })
    if (!row) throw new Error(`Техника с id=${id} не найдена`)
    await ActivityQueries.log(ctx, {
      vehicleId: row.id,
      action: "delete",
      summary: `Удалена техника: ${row.vehicleType} ${row.model}`.trim(),
    })
    return { id: row.id }
  },

  async search(query: string, ctx: AuthContext): Promise<Vehicle[]> {
    const needle = query.trim()
    if (!needle) return this.getAll(ctx)
    const pattern = `%${needle}%`
    const scope = visibilityCondition(ctx)
    const textMatch = or(
      ilike(vehicles.vehicleType, pattern),
      ilike(vehicles.model, pattern),
      ilike(vehicles.vin, pattern),
      ilike(vehicles.fullVin, pattern),
      ilike(vehicles.company, pattern),
      ilike(vehicles.manager, pattern),
      ilike(vehicles.managerSecondary, pattern),
      ilike(vehicles.buyerCompany, pattern),
      ilike(vehicles.contract, pattern),
      ilike(vehicles.dkpContract, pattern),
      ilike(vehicles.note, pattern),
      ilike(vehicles.route, pattern),
      ilike(vehicles.carrier, pattern),
      ilike(vehicles.location, pattern)
    )
    const rows = await db
      .select()
      .from(vehicles)
      .where(
        scope
          ? and(eq(vehicles.archived, false), scope, textMatch)
          : and(eq(vehicles.archived, false), textMatch)
      )
      .orderBy(vehicles.id)
    return rows.map(toVehicle)
  },

  async filter(params: VehicleFilterParams, ctx: AuthContext): Promise<Vehicle[]> {
    const scope = visibilityCondition(ctx)
    const conditions = [eq(vehicles.archived, false), ...(scope ? [scope] : [])]
    const fieldMap = {
      vehicleType: vehicles.vehicleType,
      status: vehicles.status,
      manager: vehicles.manager,
      company: vehicles.company,
      paymentStatus: vehicles.paymentStatus,
      delivery: vehicles.delivery,
    } as const

    for (const [key, column] of Object.entries(fieldMap)) {
      const value = params[key as keyof VehicleFilterParams]
      if (value) conditions.push(ilike(column, `%${value}%`))
    }

    const rows = await db
      .select()
      .from(vehicles)
      .where(and(...conditions))
      .orderBy(vehicles.id)
    return rows.map(toVehicle)
  },

  async dashboard(ctx: AuthContext, activityHours = 24): Promise<DashboardStats> {
    const all = await this.getAll(ctx)

    let available = 0
    let booked = 0
    let repair = 0
    let sold = 0
    let awaitingPayment = 0

    for (const vehicle of all) {
      const status = vehicle.status.trim().toLowerCase()
      if (status.includes("досту")) available++
      if (status.includes("брон")) booked++
      if (status.includes("ремонт")) repair++

      const match = vehicle.paymentStatus.match(/(\d+)\s*%/)
      if (match) {
        const percent = Number(match[1])
        if (percent >= 100) sold++
        else awaitingPayment++
      }
    }

    const scope = visibilityCondition(ctx)
    const recentChanges = await db
      .select()
      .from(vehicles)
      .where(
        scope
          ? and(eq(vehicles.archived, false), isNotNull(vehicles.updatedAt), scope)
          : and(eq(vehicles.archived, false), isNotNull(vehicles.updatedAt))
      )
      .orderBy(desc(vehicles.updatedAt))
      .limit(10)

    const bookingsByType: Record<string, number> = {}
    for (const vehicle of all) {
      if (!vehicle.status.trim().toLowerCase().includes("брон")) continue
      const type = vehicle.vehicleType || "Не указано"
      bookingsByType[type] = (bookingsByType[type] ?? 0) + 1
    }

    // Чужая активность — закрытая информация для manager, видна только owner.
    const managerActivity = ctx.role === "owner" ? await ActivityQueries.recent(activityHours) : []

    return {
      total: all.length,
      available,
      booked,
      sold,
      repair,
      awaitingPayment,
      recentChanges: recentChanges.map(toVehicle),
      bookingsByType,
      managerActivity,
    }
  },

  /** Снимает истёкшие брони (вызывается из /api/cron/expire-bookings). */
  async expireBookings(): Promise<Vehicle[]> {
    const rows = await db
      .update(vehicles)
      .set({
        status: STATUS_AFTER_EXPIRY,
        manager: "",
        buyerCompany: "",
        contract: "",
        bookingDate: "",
        paymentStatus: "",
        paymentDate: "",
        bookingDays: null,
        bookingExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          isNotNull(vehicles.bookingExpiresAt),
          lt(vehicles.bookingExpiresAt, new Date()),
          eq(vehicles.archived, false)
        )
      )
      .returning()
    return rows.map(toVehicle)
  },
}
