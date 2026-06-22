"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Boxes, CheckCircle2, Wallet, CalendarClock, Wrench, PackageCheck } from "lucide-react"

import { useDashboard } from "@/hooks/use-dashboard"
import { useCurrentUser } from "@/hooks/use-current-user"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentChanges } from "@/components/dashboard/recent-changes"
import { ExportPdfButton } from "@/components/dashboard/export-pdf-button"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { BreakdownCard } from "@/components/stats/breakdown-card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ACTIVITY_PERIODS = [
  { hours: 24, label: "24 часа" },
  { hours: 168, label: "7 дней" },
  { hours: 720, label: "30 дней" },
] as const

export default function DashboardPage() {
  const router = useRouter()
  const [activityHours, setActivityHours] = useState(24)
  const { data, isLoading, isError, error } = useDashboard(activityHours)
  const { data: currentUser } = useCurrentUser()

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

  const activityPeriodLabel = ACTIVITY_PERIODS.find((p) => p.hours === activityHours)?.label

  return (
    <div className="space-y-6">
      <BackgroundPaths
        className="min-h-[260px] border"
        title="ScriptErbo"
        subtitle="Уютный учёт техники, который всегда под рукой"
        actionLabel="Перейти к остаткам"
        onAction={() => router.push("/vehicles")}
      />
      {currentUser?.role === "owner" && (
        <div className="flex justify-end">
          <ExportPdfButton />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Всего техники" value={data.total} icon={Boxes} accent="navy" />
        <StatCard title="Доступно" value={data.available} icon={CheckCircle2} accent="seafoam" />
        <StatCard title="Бронь" value={data.booked} icon={CalendarClock} accent="tiffany" />
        <StatCard title="Продано" value={data.sold} icon={PackageCheck} accent="coral" />
        <StatCard title="Ремонт" value={data.repair} icon={Wrench} accent="amber" />
        <StatCard title="Ожидает оплаты" value={data.awaitingPayment} icon={Wallet} accent="tiffany" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <BreakdownCard
          title="Бронь по видам техники"
          counts={data.bookingsByType}
          onSelect={(label) =>
            router.push(`/vehicles?vehicleType=${encodeURIComponent(label)}&status=${encodeURIComponent("Брон")}`)
          }
        />
        {data.managerActivity.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-end">
              <Select
                value={String(activityHours)}
                onValueChange={(v) => v && setActivityHours(Number(v))}
              >
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTIVITY_PERIODS.map((p) => (
                    <SelectItem key={p.hours} value={String(p.hours)}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <BreakdownCard
              title={`Активность за ${activityPeriodLabel}`}
              counts={Object.fromEntries(
                data.managerActivity.map((a) => [
                  a.role === "owner" ? `${a.name} (владелец)` : a.name,
                  a.count,
                ])
              )}
              onSelect={(label) =>
                router.push(`/vehicles?search=${encodeURIComponent(label.replace(" (владелец)", ""))}`)
              }
            />
          </div>
        )}
      </div>
      <RecentChanges vehicles={data.recentChanges} />
    </div>
  )
}
