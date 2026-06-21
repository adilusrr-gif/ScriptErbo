import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { verifyPassword } from "@/lib/auth/password"
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session"

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string
      password?: string
    }
    if (!email || !password) throw new Error("Укажите email и пароль")

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1)
    if (!user) throw new Error("Неверный email или пароль")

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) throw new Error("Неверный email или пароль")

    const token = await createSessionToken({
      sub: String(user.id),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    const response = NextResponse.json({
      success: true,
      data: { name: user.name, role: user.role },
    })
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions)
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка входа"
    return NextResponse.json({ success: false, error: message }, { status: 401 })
  }
}
