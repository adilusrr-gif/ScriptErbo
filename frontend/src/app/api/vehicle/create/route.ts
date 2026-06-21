import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireAuthContext } from "@/lib/auth/current-user"
import type { VehicleInput } from "@/types/vehicle"

export async function POST(request: Request) {
  try {
    const ctx = await requireAuthContext()
    if (ctx.role !== "owner") {
      throw new Error("Создание техники доступно только владельцу")
    }
    const body = (await request.json()) as VehicleInput
    return success(await VehicleQueries.create(body, ctx))
  } catch (error) {
    return failure(error)
  }
}
