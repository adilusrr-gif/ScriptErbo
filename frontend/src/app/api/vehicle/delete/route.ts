import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireUser } from "@/lib/auth/current-user"

export async function POST(request: Request) {
  try {
    const user = await requireUser()
    if (user.role !== "owner") {
      throw new Error("Удаление техники доступно только владельцу")
    }
    const body = (await request.json()) as { id?: number }
    if (!body.id) throw new Error("Параметр id обязателен")
    return success(await VehicleQueries.remove(Number(body.id)))
  } catch (error) {
    return failure(error)
  }
}
