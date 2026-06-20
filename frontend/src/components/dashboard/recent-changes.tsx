import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { statusBadgeVariant } from "@/lib/constants"
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

export function RecentChanges({ vehicles }: { vehicles: Vehicle[] }) {
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
            {vehicles.map((vehicle) => (
              <li key={vehicle.id} className="flex items-center justify-between gap-4 py-3">
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
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                  {formatDateTime(vehicle.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
