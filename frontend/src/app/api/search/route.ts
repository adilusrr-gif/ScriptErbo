import type { NextRequest } from "next/server"

import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? ""
    return success(await VehicleQueries.search(q))
  } catch (error) {
    return failure(error)
  }
}
