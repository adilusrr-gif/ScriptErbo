import type { NextRequest } from "next/server"

import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireUser } from "@/lib/auth/current-user"

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()
    const id = request.nextUrl.searchParams.get("id")
    if (!id) throw new Error("Параметр id обязателен")
    return success(await VehicleQueries.getById(Number(id), user))
  } catch (error) {
    return failure(error)
  }
}
