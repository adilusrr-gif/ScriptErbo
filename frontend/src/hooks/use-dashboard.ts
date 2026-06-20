import { useQuery } from "@tanstack/react-query"

import { vehicleApi } from "@/lib/vehicle-api"

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"] as const,
    queryFn: vehicleApi.dashboard,
  })
}
