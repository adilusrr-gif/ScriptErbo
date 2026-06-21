import type { NextRequest } from "next/server"

import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireAuthContext } from "@/lib/auth/current-user"

const ALLOWED_HOURS = [24, 168, 720]

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireAuthContext()
    const hoursParam = Number(request.nextUrl.searchParams.get("hours"))
    const hours = ALLOWED_HOURS.includes(hoursParam) ? hoursParam : 24
    return success(await VehicleQueries.dashboard(ctx, hours))
  } catch (error) {
    return failure(error)
  }
}
