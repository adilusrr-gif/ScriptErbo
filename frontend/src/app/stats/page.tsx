"use client"

import { useMemo } from "react"

import { useVehicles } from "@/hooks/use-vehicles"
import { BreakdownCard } from "@/components/stats/breakdown-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Vehicle } from "@/types/vehicle"

function countBy(vehicles: Vehicle[], key: keyof Vehicle) {
  const counts: Record<string, number> = {}
  for (const vehicle of vehicles) {
    const value = String(vehicle[key] || "Не указано")
    counts[value] = (counts[value] ?? 0) + 1
  }
  return counts
}

export default function StatsPage() {
  const { data, isLoading, isError, error } = useVehicles()

  const breakdowns = useMemo(() => {
    if (!data) return null
    return {
      status: countBy(data, "status"),
      vehicleType: countBy(data, "vehicleType"),
      manager: countBy(data, "manager"),
      company: countBy(data, "company"),
      paymentStatus: countBy(data, "paymentStatus"),
      delivery: countBy(data, "delivery"),
    }
  }, [data])

  if (isError) {
    return <p className="text-sm text-destructive">Не удалось загрузить статистику: {error.message}</p>
  }

  if (isLoading || !breakdowns) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <BreakdownCard title="По статусу" counts={breakdowns.status} />
      <BreakdownCard title="По виду техники" counts={breakdowns.vehicleType} />
      <BreakdownCard title="По менеджеру" counts={breakdowns.manager} />
      <BreakdownCard title="По компании" counts={breakdowns.company} />
      <BreakdownCard title="По статусу оплаты" counts={breakdowns.paymentStatus} />
      <BreakdownCard title="По доставке" counts={breakdowns.delivery} />
    </div>
  )
}
