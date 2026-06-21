import { cookies } from "next/headers"

import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "./session"
import type { AuthContext } from "@/lib/db/queries"

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function requireUser(): Promise<SessionPayload> {
  const user = await getCurrentUser()
  if (!user) throw new Error("Не авторизован")
  return user
}

export async function requireOwner(): Promise<SessionPayload> {
  const user = await requireUser()
  if (user.role !== "owner") throw new Error("Доступно только владельцу")
  return user
}

/** SessionPayload -> AuthContext для VehicleQueries/ActivityQueries. */
export function toAuthContext(session: SessionPayload): AuthContext {
  return { role: session.role, name: session.name, userId: Number(session.sub) }
}

export async function requireAuthContext(): Promise<AuthContext> {
  return toAuthContext(await requireUser())
}
