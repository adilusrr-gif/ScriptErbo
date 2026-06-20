import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { vehicleApi } from "@/lib/vehicle-api"
import type { VehicleFilterParams, VehicleInput } from "@/types/vehicle"

const vehiclesKey = ["vehicles"] as const
const vehicleKey = (id: number) => ["vehicle", id] as const
const dashboardKey = ["dashboard"] as const

export function useVehicles() {
  return useQuery({
    queryKey: vehiclesKey,
    queryFn: vehicleApi.list,
  })
}

export function useVehicle(id: number) {
  return useQuery({
    queryKey: vehicleKey(id),
    queryFn: () => vehicleApi.getById(id),
    enabled: Number.isFinite(id),
  })
}

export function useSearchVehicles(query: string) {
  return useQuery({
    queryKey: ["vehicles", "search", query] as const,
    queryFn: () => vehicleApi.search(query),
    enabled: query.trim().length > 0,
  })
}

export function useFilterVehicles(params: VehicleFilterParams) {
  return useQuery({
    queryKey: ["vehicles", "filter", params] as const,
    queryFn: () => vehicleApi.filter(params),
    enabled: Object.values(params).some(Boolean),
  })
}

function useInvalidateVehicleQueries() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: vehiclesKey })
    queryClient.invalidateQueries({ queryKey: dashboardKey })
  }
}

export function useCreateVehicle() {
  const invalidate = useInvalidateVehicleQueries()
  return useMutation({
    mutationFn: (data: VehicleInput) => vehicleApi.create(data),
    onSuccess: () => {
      invalidate()
      toast.success("Техника добавлена")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()
  const invalidate = useInvalidateVehicleQueries()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VehicleInput> }) =>
      vehicleApi.update(id, data),
    onSuccess: (updated) => {
      invalidate()
      queryClient.setQueryData(vehicleKey(updated.id), updated)
      toast.success("Изменения сохранены")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteVehicle() {
  const invalidate = useInvalidateVehicleQueries()
  return useMutation({
    mutationFn: (id: number) => vehicleApi.delete(id),
    onSuccess: () => {
      invalidate()
      toast.success("Техника удалена")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
