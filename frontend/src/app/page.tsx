"use client"

import { Boxes, CheckCircle2, Wallet, CalendarClock, Wrench, PackageCheck } from "lucide-react"

import { useDashboard } from "@/hooks/use-dashboard"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentChanges } from "@/components/dashboard/recent-changes"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard()

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Не удалось загрузить данные: {error.message}
      </p>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Всего техники" value={data.total} icon={Boxes} />
        <StatCard title="Доступно" value={data.available} icon={CheckCircle2} />
        <StatCard title="Бронь" value={data.booked} icon={CalendarClock} />
        <StatCard title="Продано" value={data.sold} icon={PackageCheck} />
        <StatCard title="Ремонт" value={data.repair} icon={Wrench} />
        <StatCard title="Ожидает оплаты" value={data.awaitingPayment} icon={Wallet} />
      </div>
      <RecentChanges vehicles={data.recentChanges} />
    </div>
  )
}
