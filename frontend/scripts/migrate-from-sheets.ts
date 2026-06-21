import { config } from "dotenv"
import { readFileSync } from "fs"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

import { vehicles } from "../src/lib/db/schema"

config({ path: ".env.local" })

interface ExportedVehicle {
  id: number
  vehicleType: string
  model: string
  year: number | null
  pr: string
  vin: string
  fullVin: string
  sbkts: string
  customsCleared: string
  recyclingFee: string
  epts: string
  trafficRegistration: string
  company: string
  status: string
  manager: string
  statusSecondary: string
  managerSecondary: string
  bookingDate: string
  buyerCompany: string
  contract: string
  paymentStatus: string
  paymentDate: string
  location: string
  arrivalDateLegacy: string
  dkpContract: string
  currentState: string
  departureDate: string
  note: string
  arrivalDate: string
  app: string
  rjv: string
  months: string
  delivery: string
  carrier: string
  route: string
  yearSecondary: number | null
  updatedAt: string
  archived: boolean
}

async function main() {
  const path = process.argv[2]
  if (!path) {
    throw new Error("Использование: tsx migrate-from-sheets.ts <export.json>")
  }

  const raw = JSON.parse(readFileSync(path, "utf8"))
  const rows: ExportedVehicle[] = raw.data ?? raw

  console.log(`Загружено ${rows.length} строк из экспорта`)

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL не задан")

  const pool = new Pool({ connectionString })
  const db = drizzle(pool)

  // "№" в исходной таблице не уникален (много строк с id=0), поэтому id не
  // переносим — Postgres присвоит новые уникальные id через serial.
  const values = rows.map((row) => ({
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
    archived: row.archived,
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : null,
  }))

  console.log("Очищаю таблицу vehicles перед загрузкой...")
  await db.delete(vehicles)

  const chunkSize = 200
  let inserted = 0
  for (let i = 0; i < values.length; i += chunkSize) {
    const chunk = values.slice(i, i + chunkSize)
    await db.insert(vehicles).values(chunk)
    inserted += chunk.length
    console.log(`Вставлено ${inserted} / ${values.length}`)
  }

  await pool.end()
  console.log("Миграция завершена")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
