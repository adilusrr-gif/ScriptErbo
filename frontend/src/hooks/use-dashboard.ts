import { useQuery } from "@tanstack/react-query"

import { vehicleApi } from "@/lib/vehicle-api"

export function useDashboard(activityHours = 24) {
  return useQuery({
    queryKey: ["dashboard", activityHours] as const,
    queryFn: () => vehicleApi.dashboard(activityHours),
  })
}
