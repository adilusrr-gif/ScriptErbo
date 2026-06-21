import { config } from "dotenv"
config({ path: ".env.local" })

import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"

import { users } from "../src/lib/db/schema"
import { hashPassword } from "../src/lib/auth/password"

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4]
  if (!email || !password || !name) {
    throw new Error("Использование: tsx seed-owner.ts <email> <password> <name>")
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const db = drizzle(pool)

  const passwordHash = await hashPassword(password)
  const [row] = await db
    .insert(users)
    .values({ email: email.toLowerCase(), passwordHash, name, role: "owner" })
    .returning({ id: users.id, email: users.email, name: users.name, role: users.role })

  console.log("Создан владелец:", row)
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
