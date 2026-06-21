import { UserQueries } from "@/lib/db/user-queries"
import { failure, success } from "@/lib/api-response"
import { requireOwner } from "@/lib/auth/current-user"
import type { Role } from "@/lib/auth/session"

export async function GET() {
  try {
    await requireOwner()
    return success(await UserQueries.list())
  } catch (error) {
    return failure(error)
  }
}

export async function POST(request: Request) {
  try {
    await requireOwner()
    const body = (await request.json()) as {
      email?: string
      password?: string
      name?: string
      role?: Role
    }
    if (!body.email || !body.password || !body.name) {
      throw new Error("Укажите email, пароль и имя")
    }
    const user = await UserQueries.create({
      email: body.email,
      password: body.password,
      name: body.name,
      role: body.role === "owner" ? "owner" : "manager",
    })
    return success(user)
  } catch (error) {
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "Пользователь с таким email уже существует"
        : error
    return failure(message)
  }
}
