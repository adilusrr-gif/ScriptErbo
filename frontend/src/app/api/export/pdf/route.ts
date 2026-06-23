import { renderToBuffer } from "@react-pdf/renderer"

import { VehicleQueries } from "@/lib/db/queries"
import { requireOwner, toAuthContext } from "@/lib/auth/current-user"
import { registerPdfFonts } from "@/lib/pdf/fonts"
import { InventoryReport, type ManagerGroup } from "@/lib/pdf/inventory-report"
import { ALL_REPORT_SECTION_IDS, type ReportSectionId } from "@/lib/pdf/report-sections"
import type { Vehicle } from "@/types/vehicle"

function isAvailable(v: Vehicle) {
  return v.status.trim().toLowerCase().includes("досту")
}

function isBooked(v: Vehicle) {
  return v.status.trim().toLowerCase().includes("брон")
}

function isRented(v: Vehicle) {
  return v.status.trim().toLowerCase().includes("аренд")
}

function isRepair(v: Vehicle) {
  return v.status.trim().toLowerCase().includes("ремонт")
}

function isSold(v: Vehicle) {
  const match = v.paymentStatus.match(/(\d+)\s*%/)
  return match ? Number(match[1]) >= 100 : false
}

function parseSections(value: string | null): ReportSectionId[] {
  if (!value) return ALL_REPORT_SECTION_IDS
  const requested = value.split(",").map((s) => s.trim())
  const valid = ALL_REPORT_SECTION_IDS.filter((id) => requested.includes(id))
  return valid.length > 0 ? valid : ALL_REPORT_SECTION_IDS
}

function buildManagerGroups(vehicles: Vehicle[]): ManagerGroup[] {
  const byManager = new Map<string, Vehicle[]>()
  for (const vehicle of vehicles) {
    const manager = vehicle.manager.trim()
    if (!manager) continue
    if (!byManager.has(manager)) byManager.set(manager, [])
    byManager.get(manager)!.push(vehicle)
  }

  return Array.from(byManager.entries())
    .map(([manager, group]) => ({
      manager,
      total: group.length,
      available: group.filter(isAvailable).length,
      booked: group.filter(isBooked).length,
      sold: group.filter(isSold).length,
      rented: group.filter(isRented).length,
      repair: group.filter(isRepair).length,
      vehicles: group,
    }))
    .sort((a, b) => b.total - a.total)
}

export async function GET(request: Request) {
  try {
    const session = await requireOwner()
    const ctx = toAuthContext(session)
    const vehicles = await VehicleQueries.getAll(ctx)

    const { searchParams } = new URL(request.url)
    const sections = parseSections(searchParams.get("sections"))

    const availableVehicles = vehicles.filter(isAvailable)
    const bookedVehicles = vehicles.filter(isBooked)
    const soldVehicles = vehicles.filter(isSold)
    const rentedVehicles = vehicles.filter(isRented)

    registerPdfFonts()
    const buffer = await renderToBuffer(
      InventoryReport({
        data: {
          generatedAt: new Date().toLocaleString("ru-RU", {
            dateStyle: "long",
            timeStyle: "short",
          }),
          sections,
          summary: {
            total: vehicles.length,
            available: availableVehicles.length,
            booked: bookedVehicles.length,
            sold: soldVehicles.length,
            rented: rentedVehicles.length,
            repair: vehicles.filter(isRepair).length,
            awaitingPayment: vehicles.filter((v) => v.paymentStatus.match(/\d+\s*%/) && !isSold(v))
              .length,
          },
          availableVehicles,
          bookedVehicles,
          soldVehicles,
          rentedVehicles,
          managerGroups: buildManagerGroups(vehicles),
        },
      })
    )

    const filename = `scripterbo-report-${new Date().toISOString().slice(0, 10)}.pdf`
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сформировать отчёт"
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}
