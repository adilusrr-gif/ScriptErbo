import { drizzle } from "drizzle-orm/neon-serverless"
import { Pool, neonConfig } from "@neondatabase/serverless"

import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL не задан")
}

if (process.env.LOCAL_WSPROXY_PORT) {
  const port = process.env.LOCAL_WSPROXY_PORT
  neonConfig.wsProxy = (host) => `${host}:${port}/v1`
  neonConfig.useSecureWebSocket = false
  neonConfig.pipelineConnect = false
}

const pool = new Pool({ connectionString })

export const db = drizzle(pool, { schema })
