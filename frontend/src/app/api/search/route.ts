import type { NextRequest } from "next/server"

import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireUser } from "@/lib/auth/current-user"

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const q = request.nextUrl.searchParams.get("q") ?? ""
    return success(await VehicleQueries.search(q, user))
  } catch (error) {
    return failure(error)
  }
}
