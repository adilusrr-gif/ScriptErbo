import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import { requireUser } from "@/lib/auth/current-user"

export async function GET() {
  try {
    const user = await requireUser()
    return success(await VehicleQueries.dashboard(user))
  } catch (error) {
    return failure(error)
  }
}
