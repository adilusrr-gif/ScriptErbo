"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
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

  function goTo(param: string, label: string) {
    if (label === "Не указано") return
    router.push(`/vehicles?${param}=${encodeURIComponent(label)}`)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <BreakdownCard
        title="По статусу"
        counts={breakdowns.status}
        onSelect={(label) => goTo("status", label)}
      />
      <BreakdownCard
        title="По виду техники"
        counts={breakdowns.vehicleType}
        onSelect={(label) => goTo("vehicleType", label)}
      />
      <BreakdownCard
        title="По менеджеру"
        counts={breakdowns.manager}
        onSelect={(label) => goTo("search", label)}
      />
      <BreakdownCard
        title="По компании"
        counts={breakdowns.company}
        onSelect={(label) => goTo("search", label)}
      />
      <BreakdownCard
        title="По статусу оплаты"
        counts={breakdowns.paymentStatus}
        onSelect={(label) => goTo("paymentStatus", label)}
      />
      <BreakdownCard
        title="По доставке"
        counts={breakdowns.delivery}
        onSelect={(label) => goTo("delivery", label)}
      />
    </div>
  )
}
