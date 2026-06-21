import type { NextRequest } from "next/server"

import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")
    if (!id) throw new Error("Параметр id обязателен")
    return success(await VehicleQueries.getById(Number(id)))
  } catch (error) {
    return failure(error)
  }
}
