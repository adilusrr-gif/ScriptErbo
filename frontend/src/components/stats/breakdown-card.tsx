"use client"

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface BreakdownCardProps {
  title: string
  counts: Record<string, number>
  onSelect?: (label: string) => void
}

const BAR_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

const MAX_BARS = 8
const ROW_HEIGHT = 32

const chartConfig: ChartConfig = {
  value: { label: "Количество" },
}

export function BreakdownCard({ title, counts, onSelect }: BreakdownCardProps) {
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const top = sorted.slice(0, MAX_BARS)
  const rest = sorted.slice(MAX_BARS)
  const restTotal = rest.reduce((sum, [, count]) => sum + count, 0)

  const data = top.map(([label, value]) => ({ label, value }))
  if (rest.length > 0) {
    data.push({ label: `+${rest.length} других`, value: restTotal })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет данных</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full"
            style={{ height: Math.max(160, data.length * ROW_HEIGHT) }}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 28, top: 4, bottom: 4 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                width={140}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={{ fill: "var(--muted)" }}
              />
              <Bar
                dataKey="value"
                radius={4}
                className={onSelect ? "cursor-pointer" : undefined}
                onClick={(item) => {
                  const label = item.payload?.label as string | undefined
                  if (onSelect && label && !label.startsWith("+")) onSelect(label)
                }}
              >
                <LabelList dataKey="value" position="right" className="fill-foreground text-xs" />
                {data.map((entry, index) => (
                  <Cell key={entry.label} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
