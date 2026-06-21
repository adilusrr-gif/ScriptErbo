import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { id?: number }
    if (!body.id) throw new Error("Параметр id обязателен")
    return success(await VehicleQueries.remove(Number(body.id)))
  } catch (error) {
    return failure(error)
  }
}
