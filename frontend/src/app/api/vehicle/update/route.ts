import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import type { VehicleInput } from "@/types/vehicle"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<VehicleInput> & { id?: number }
    if (!body.id) throw new Error("Параметр id обязателен")
    const { id, ...rest } = body
    return success(await VehicleQueries.update(Number(id), rest))
  } catch (error) {
    return failure(error)
  }
}
