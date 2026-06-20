import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BreakdownCardProps {
  title: string
  counts: Record<string, number>
}

export function BreakdownCard({ title, counts }: BreakdownCardProps) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const max = Math.max(1, ...entries.map(([, count]) => count))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет данных</p>
        ) : (
          entries.map(([label, count]) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate">{label}</span>
                <span className="font-medium">{count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
