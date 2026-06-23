"use client"

import Link from "next/link"
import { formatDistanceToNow, differenceInHours } from "date-fns"
import { ru } from "date-fns/locale"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { paymentBadgeVariant } from "@/lib/constants"
import type { Vehicle } from "@/types/vehicle"

function expiryAccent(hoursLeft: number) {
  if (hoursLeft <= 24) return { color: "var(--chart-4)", variant: "destructive" as const }
  if (hoursLeft <= 72) return { color: "var(--chart-3)", variant: "secondary" as const }
  return { color: "var(--chart-1)", variant: "default" as const }
}

function ExpiryBadge({ expiresAt }: { expiresAt: string }) {
  if (!expiresAt) return null
  const date = new Date(expiresAt)
  if (Number.isNaN(date.getTime())) return null

  const hoursLeft = differenceInHours(date, new Date())
  if (hoursLeft <= 0) {
    return <Badge variant="destructive">Бронь истекла</Badge>
  }
  const { variant } = expiryAccent(hoursLeft)
  return (
    <Badge variant={variant}>
      Истекает {formatDistanceToNow(date, { addSuffix: true, locale: ru })}
    </Badge>
  )
}

export function BookingCard({ vehicle }: { vehicle: Vehicle }) {
  const date = vehicle.bookingExpiresAt ? new Date(vehicle.bookingExpiresAt) : null
  const hoursLeft = date && !Number.isNaN(date.getTime()) ? differenceInHours(date, new Date()) : null
  const accentColor = hoursLeft !== null ? expiryAccent(hoursLeft).color : "var(--chart-2)"

  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1"
        style={{ background: `linear-gradient(180deg, ${accentColor}, transparent)` }}
      />
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/vehicles/${vehicle.id}`} className="font-medium hover:underline">
            {vehicle.vehicleType} {vehicle.model}
          </Link>
          <span className="text-xs text-muted-foreground">№{vehicle.id}</span>
        </div>

        <ExpiryBadge expiresAt={vehicle.bookingExpiresAt} />

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>
            <div className="text-xs">Менеджер</div>
            <div className="text-foreground">{vehicle.manager || "—"}</div>
          </div>
          <div>
            <div className="text-xs">Покупатель</div>
            <div className="text-foreground">{vehicle.buyerCompany || "—"}</div>
          </div>
          <div>
            <div className="text-xs">Договор</div>
            <div className="text-foreground">{vehicle.contract || "—"}</div>
          </div>
          <div>
            <div className="text-xs">Оплата</div>
            <Badge variant={paymentBadgeVariant(vehicle.paymentStatus)}>
              {vehicle.paymentStatus || "—"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
