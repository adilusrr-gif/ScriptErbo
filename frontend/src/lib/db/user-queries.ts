import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { users, type UserRow } from "@/lib/db/schema"
import { hashPassword } from "@/lib/auth/password"
import type { Role } from "@/lib/auth/session"

export interface PublicUser {
  id: number
  email: string
  name: string
  role: Role
  createdAt: string
}

function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
  }
}

export const UserQueries = {
  async list(): Promise<PublicUser[]> {
    const rows = await db.select().from(users).orderBy(users.id)
    return rows.map(toPublicUser)
  },

  async create(input: { email: string; password: string; name: string; role: Role }): Promise<PublicUser> {
    const email = input.email.trim().toLowerCase()
    const name = input.name.trim()
    if (!email || !input.password || !name) {
      throw new Error("Укажите email, пароль и имя")
    }
    const passwordHash = await hashPassword(input.password)
    const [row] = await db
      .insert(users)
      .values({ email, passwordHash, name, role: input.role })
      .returning()
    return toPublicUser(row)
  },

  async remove(id: number): Promise<{ id: number }> {
    const [row] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id })
    if (!row) throw new Error(`Пользователь с id=${id} не найден`)
    return { id: row.id }
  },
}
