import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"

export async function GET() {
  try {
    return success(await VehicleQueries.dashboard())
  } catch (error) {
    return failure(error)
  }
}
