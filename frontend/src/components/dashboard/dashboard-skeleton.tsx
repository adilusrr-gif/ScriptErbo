import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function StatCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-1 bg-muted" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-12" />
      </CardContent>
    </Card>
  )
}

const BAR_WIDTHS = ["w-full", "w-5/6", "w-2/3", "w-3/4", "w-1/2", "w-2/5"]

function BreakdownCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="space-y-3">
        {BAR_WIDTHS.map((width, i) => (
          <Skeleton key={i} className={`h-6 ${width}`} />
        ))}
      </CardContent>
    </Card>
  )
}

function RecentChangesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4 border-l-2 border-muted py-3 pl-3">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="hidden h-4 w-16 shrink-0 sm:block" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <BreakdownCardSkeleton />
        <BreakdownCardSkeleton />
      </div>
      <RecentChangesSkeleton />
    </div>
  )
}
