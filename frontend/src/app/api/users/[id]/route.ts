import { UserQueries } from "@/lib/db/user-queries"
import { failure, success } from "@/lib/api-response"
import { requireOwner } from "@/lib/auth/current-user"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireOwner()
    const { id } = await params
    return success(await UserQueries.remove(Number(id)))
  } catch (error) {
    return failure(error)
  }
}
