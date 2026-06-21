import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireAuthContext } from "@/lib/auth/current-user"

export async function GET() {
  try {
    const ctx = await requireAuthContext()
    return success(await VehicleQueries.getAll(ctx))
  } catch (error) {
    return failure(error)
  }
}
