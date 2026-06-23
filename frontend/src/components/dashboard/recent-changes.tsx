"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { statusBadgeVariant, statusAccentColor } from "@/lib/constants"
import type { Vehicle } from "@/types/vehicle"

function formatDateTime(value: string) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatRelative(value: string) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return formatDistanceToNow(date, { addSuffix: true, locale: ru })
}

export function RecentChanges({ vehicles }: { vehicles: Vehicle[] }) {
  const reducedMotion = useReducedMotion()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние изменения</CardTitle>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <p className="text-sm text-muted-foreground">Изменений пока нет</p>
        ) : (
          <ul className="divide-y">
            {vehicles.map((vehicle, index) => (
              <motion.li
                key={vehicle.id}
                initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className="flex items-center gap-4 border-l-2 py-3 pl-3"
                style={{ borderLeftColor: statusAccentColor(vehicle.status) }}
              >
                <Link
                  href={`/vehicles/${vehicle.id}`}
                  className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
                >
                  {vehicle.vehicleType} {vehicle.model}{" "}
                  <span className="text-muted-foreground">· {vehicle.vin || "без VIN"}</span>
                </Link>
                <Badge variant={statusBadgeVariant(vehicle.status)}>
                  {vehicle.status || "—"}
                </Badge>
                <span
                  className="hidden shrink-0 text-xs text-muted-foreground sm:inline"
                  title={formatDateTime(vehicle.updatedAt)}
                >
                  {formatRelative(vehicle.updatedAt)}
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
