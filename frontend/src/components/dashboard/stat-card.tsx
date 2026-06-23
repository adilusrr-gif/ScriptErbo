"use client"

import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCountUp } from "@/hooks/use-count-up"
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
  /** Если задан, вся карточка становится ссылкой (например, на отфильтрованный список техники). */
  href?: string
}

function AnimatedValue({ value }: { value: number | string }) {
  const animated = useCountUp(typeof value === "number" ? value : 0)
  return <>{typeof value === "number" ? animated : value}</>
}

export function StatCard({ title, value, icon: Icon, accent, className, href }: StatCardProps) {
  const accentColor = accent ? ACCENT_VAR[accent] : undefined

  const card = (
    <Card
      className={cn(
        "relative overflow-hidden shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_12px_rgb(0_0_0/0.06)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgb(0_0_0/0.05),0_8px_20px_rgb(0_0_0/0.08)]",
        href && "ring-border hover:ring-1",
        className
      )}
    >
      {accentColor && (
        <>
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-1"
            style={{
              background: `linear-gradient(180deg, ${accentColor}, transparent)`,
            }}
          />
          <div
            aria-hidden
            className="absolute -top-10 -right-10 size-32 rounded-full opacity-[0.12]"
            style={{
              background: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
            }}
          />
        </>
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
        <div className="text-2xl font-bold font-heading tabular-nums">
          <AnimatedValue value={value} />
        </div>
      </CardContent>
    </Card>
  )

  return href ? (
    <Link href={href} className="block">
      {card}
    </Link>
  ) : (
    card
  )
}
