import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireAuthContext } from "@/lib/auth/current-user"

export async function POST(request: Request) {
  try {
    const ctx = await requireAuthContext()
    if (ctx.role !== "owner") {
      throw new Error("Удаление техники доступно только владельцу")
    }
    const body = (await request.json()) as { id?: number }
    if (!body.id) throw new Error("Параметр id обязателен")
    return success(await VehicleQueries.remove(Number(body.id), ctx))
  } catch (error) {
    return failure(error)
  }
}
