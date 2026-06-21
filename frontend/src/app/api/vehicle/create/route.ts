import { VehicleQueries } from "@/lib/db/queries"
import { failure, success } from "@/lib/api-response"
import type { VehicleInput } from "@/types/vehicle"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VehicleInput
    return success(await VehicleQueries.create(body))
  } catch (error) {
    return failure(error)
  }
}
