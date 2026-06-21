import type { NextRequest } from "next/server"

import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireAuthContext } from "@/lib/auth/current-user"

export async function GET(request: NextRequest) {
  try {
    const ctx = await requireAuthContext()
    const id = request.nextUrl.searchParams.get("id")
    if (!id) throw new Error("Параметр id обязателен")
    return success(await VehicleQueries.getById(Number(id), ctx))
  } catch (error) {
    return failure(error)
  }
}
