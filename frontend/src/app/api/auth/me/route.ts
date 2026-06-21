import { getCurrentUser } from "@/lib/auth/current-user"
import { failure, success } from "@/lib/api-response"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error("Не авторизован")
    return success({ name: user.name, email: user.email, role: user.role })
  } catch (error) {
    return failure(error)
  }
}
