"use client"

import { useRouter } from "next/navigation"
import { Boxes, CheckCircle2, Wallet, CalendarClock, Wrench, PackageCheck } from "lucide-react"

import { useDashboard } from "@/hooks/use-dashboard"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentChanges } from "@/components/dashboard/recent-changes"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const router = useRouter()
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
      <BackgroundPaths
        className="min-h-[260px] border"
        title="ScriptErbo"
        subtitle="Уютный учёт техники, который всегда под рукой"
        actionLabel="Перейти к остаткам"
        onAction={() => router.push("/vehicles")}
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Всего техники" value={data.total} icon={Boxes} accent="navy" />
        <StatCard title="Доступно" value={data.available} icon={CheckCircle2} accent="seafoam" />
        <StatCard title="Бронь" value={data.booked} icon={CalendarClock} accent="tiffany" />
        <StatCard title="Продано" value={data.sold} icon={PackageCheck} accent="coral" />
        <StatCard title="Ремонт" value={data.repair} icon={Wrench} accent="amber" />
        <StatCard title="Ожидает оплаты" value={data.awaitingPayment} icon={Wallet} accent="tiffany" />
      </div>
      <RecentChanges vehicles={data.recentChanges} />
    </div>
  )
}
