import type { NextRequest } from "next/server"

import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireUser } from "@/lib/auth/current-user"
import type { VehicleFilterParams } from "@/types/vehicle"

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const params = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    ) as VehicleFilterParams
    return success(await VehicleQueries.filter(params, user))
  } catch (error) {
    return failure(error)
  }
}
