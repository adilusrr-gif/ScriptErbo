import { renderToBuffer } from "@react-pdf/renderer"

import { VehicleQueries } from "@/lib/db/queries"
import { requireOwner, toAuthContext } from "@/lib/auth/current-user"
import { registerPdfFonts } from "@/lib/pdf/fonts"
import { InventoryReport, type ManagerGroup } from "@/lib/pdf/inventory-report"
import type { Vehicle } from "@/types/vehicle"

function isAvailable(v: Vehicle) {
  return v.status.trim().toLowerCase().includes("досту")
}

function isBooked(v: Vehicle) {
  return v.status.trim().toLowerCase().includes("брон")
}

function isRepair(v: Vehicle) {
  return v.status.trim().toLowerCase().includes("ремонт")
}

function isSold(v: Vehicle) {
  const match = v.paymentStatus.match(/(\d+)\s*%/)
  return match ? Number(match[1]) >= 100 : false
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
      repair: group.filter(isRepair).length,
      vehicles: group,
    }))
    .sort((a, b) => b.total - a.total)
}

export async function GET() {
  try {
    const session = await requireOwner()
    const ctx = toAuthContext(session)
    const vehicles = await VehicleQueries.getAll(ctx)

    const availableVehicles = vehicles.filter(isAvailable)
    const bookedVehicles = vehicles.filter(isBooked)

    registerPdfFonts()
    const buffer = await renderToBuffer(
      InventoryReport({
        data: {
          generatedAt: new Date().toLocaleString("ru-RU", {
            dateStyle: "long",
            timeStyle: "short",
          }),
          summary: {
            total: vehicles.length,
            available: availableVehicles.length,
            booked: bookedVehicles.length,
            sold: vehicles.filter(isSold).length,
            repair: vehicles.filter(isRepair).length,
            awaitingPayment: vehicles.filter((v) => v.paymentStatus.match(/\d+\s*%/) && !isSold(v))
              .length,
          },
          availableVehicles,
          bookedVehicles,
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
