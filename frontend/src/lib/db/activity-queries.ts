import { gt, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { activityLog } from "@/lib/db/schema"

export interface ActivityActor {
  userId: number | null
  name: string
  role: string
}

export interface ActivityLogEntry {
  vehicleId: number | null
  action: "create" | "update" | "delete"
  summary: string
}

export interface ManagerActivity {
  name: string
  role: string
  count: number
}

export const ActivityQueries = {
  async log(actor: ActivityActor, entry: ActivityLogEntry): Promise<void> {
    await db.insert(activityLog).values({
      userId: actor.userId,
      userName: actor.name,
      userRole: actor.role,
      vehicleId: entry.vehicleId,
      action: entry.action,
      summary: entry.summary,
    })
  },

  async last24h(): Promise<ManagerActivity[]> {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const rows = await db
      .select({
        name: activityLog.userName,
        role: activityLog.userRole,
        count: sql<number>`count(*)`.as("count"),
      })
      .from(activityLog)
      .where(gt(activityLog.createdAt, since))
      .groupBy(activityLog.userName, activityLog.userRole)
      .orderBy(sql`count(*) desc`)

    return rows.map((row) => ({ name: row.name, role: row.role, count: Number(row.count) }))
  },
}
