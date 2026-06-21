import { NextResponse } from "next/server"

import { VehicleQueries } from "@/lib/db/queries"
import { ActivityQueries } from "@/lib/db/activity-queries"

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get("authorization")
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: "Не авторизован" }, { status: 401 })
  }

  const expired = await VehicleQueries.expireBookings()

  for (const vehicle of expired) {
    await ActivityQueries.log(
      { userId: null, name: "Система (авто)", role: "system" },
      {
        vehicleId: vehicle.id,
        action: "update",
        summary: `Бронь истекла, статус сброшен: ${vehicle.vehicleType} ${vehicle.model}`.trim(),
      }
    )
  }

  return NextResponse.json({ success: true, data: { reverted: expired.length } })
}
