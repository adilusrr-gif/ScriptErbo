import { and, desc, eq, ilike, isNotNull, or } from "drizzle-orm"

import { db } from "@/lib/db"
import { vehicles, type VehicleRow } from "@/lib/db/schema"
import type {
  DashboardStats,
  Vehicle,
  VehicleFilterParams,
  VehicleInput,
} from "@/types/vehicle"

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

export const VehicleQueries = {
  async getAll(): Promise<Vehicle[]> {
    const rows = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.archived, false))
      .orderBy(vehicles.id)
    return rows.map(toVehicle)
  },

  async getById(id: number): Promise<Vehicle> {
    const [row] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, id))
      .limit(1)
    if (!row) throw new Error(`Техника с id=${id} не найдена`)
    return toVehicle(row)
  },

  async create(input: VehicleInput): Promise<Vehicle> {
    const [row] = await db
      .insert(vehicles)
      .values({ ...toInsertValues(input), updatedAt: new Date() })
      .returning()
    return toVehicle(row)
  },

  async update(id: number, input: Partial<VehicleInput>): Promise<Vehicle> {
    const values = toInsertValues(input)
    delete values.id
    const [row] = await db
      .update(vehicles)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning()
    if (!row) throw new Error(`Техника с id=${id} не найдена`)
    return toVehicle(row)
  },

  async remove(id: number): Promise<{ id: number }> {
    const [row] = await db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning({ id: vehicles.id })
    if (!row) throw new Error(`Техника с id=${id} не найдена`)
    return { id: row.id }
  },

  async search(query: string): Promise<Vehicle[]> {
    const needle = query.trim()
    if (!needle) return this.getAll()
    const pattern = `%${needle}%`
    const rows = await db
      .select()
      .from(vehicles)
      .where(
        and(
          eq(vehicles.archived, false),
          or(
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
        )
      )
      .orderBy(vehicles.id)
    return rows.map(toVehicle)
  },

  async filter(params: VehicleFilterParams): Promise<Vehicle[]> {
    const conditions = [eq(vehicles.archived, false)]
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

  async dashboard(): Promise<DashboardStats> {
    const all = await this.getAll()

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

    const recentChanges = await db
      .select()
      .from(vehicles)
      .where(and(eq(vehicles.archived, false), isNotNull(vehicles.updatedAt)))
      .orderBy(desc(vehicles.updatedAt))
      .limit(10)

    return {
      total: all.length,
      available,
      booked,
      sold,
      repair,
      awaitingPayment,
      recentChanges: recentChanges.map(toVehicle),
    }
  },
}
