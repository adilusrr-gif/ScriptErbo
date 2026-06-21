import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool } from "@neondatabase/serverless"

import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL не задан")
}

const pool = new Pool({ connectionString })

export const db = drizzle(pool, { schema })
