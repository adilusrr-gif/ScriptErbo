import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type StatAccent = "tiffany" | "seafoam" | "amber" | "coral" | "navy"

const ACCENT_VAR: Record<StatAccent, string> = {
  tiffany: "var(--chart-1)",
  seafoam: "var(--chart-2)",
  amber: "var(--chart-3)",
  coral: "var(--chart-4)",
  navy: "var(--chart-5)",
}

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  accent?: StatAccent
  className?: string
}

export function StatCard({ title, value, icon: Icon, accent, className }: StatCardProps) {
  const accentColor = accent ? ACCENT_VAR[accent] : undefined

  return (
    <Card
      className={cn(
        "relative overflow-hidden shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_12px_rgb(0_0_0/0.06)] transition-shadow duration-200 hover:shadow-[0_2px_4px_rgb(0_0_0/0.05),0_8px_20px_rgb(0_0_0/0.08)]",
        className
      )}
    >
      {accentColor && (
        <div
          aria-hidden
          className="absolute -top-6 -right-6 size-24 rounded-full opacity-10"
          style={{ backgroundColor: accentColor }}
        />
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon
          className="size-4 text-muted-foreground"
          style={accentColor ? { color: accentColor } : undefined}
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-heading">{value}</div>
      </CardContent>
    </Card>
  )
}
