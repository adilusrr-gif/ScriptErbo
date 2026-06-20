import { apiClient } from "@/lib/api-client"
import type { DashboardStats, Vehicle, VehicleFilterParams, VehicleInput } from "@/types/vehicle"

export const vehicleApi = {
  list: () => apiClient.get<Vehicle[]>("vehicles"),

  getById: (id: number) => apiClient.get<Vehicle>("vehicle", { id }),

  search: (query: string) => apiClient.get<Vehicle[]>("search", { q: query }),

  filter: (params: VehicleFilterParams) =>
    apiClient.get<Vehicle[]>("filter", params as Record<string, string | undefined>),

  create: (data: VehicleInput) => apiClient.post<Vehicle>("vehicle/create", data),

  update: (id: number, data: Partial<VehicleInput>) =>
    apiClient.post<Vehicle>("vehicle/update", { id, ...data }),

  delete: (id: number) => apiClient.post<{ id: number }>("vehicle/delete", { id }),

  dashboard: () => apiClient.get<DashboardStats>("dashboard"),
}
