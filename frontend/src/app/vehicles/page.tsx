"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { useDeleteVehicle, useUpdateVehicle, useVehicles } from "@/hooks/use-vehicles"
import { VehicleTable } from "@/components/vehicles/vehicle-table"
import {
  VehicleFilters,
  defaultVehicleListFilters,
  type VehicleListFilters,
} from "@/components/vehicles/vehicle-filters"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toText } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/use-current-user"
import type { Vehicle } from "@/types/vehicle"

function includesNormalized(value: unknown, needle: string) {
  return toText(value).trim().toLowerCase().includes(needle.trim().toLowerCase())
}

function matchesFilters(vehicle: Vehicle, filters: VehicleListFilters) {
  const search = filters.search.trim().toLowerCase()
  if (search) {
    const haystack = [
      vehicle.vehicleType,
      vehicle.model,
      vehicle.vin,
      vehicle.fullVin,
      vehicle.contract,
      vehicle.manager,
      vehicle.company,
      vehicle.buyerCompany,
    ]
      .map(toText)
      .join(" ")
      .toLowerCase()
    if (!haystack.includes(search)) return false
  }
  if (filters.status && !includesNormalized(vehicle.status, filters.status)) return false
  if (filters.vehicleType && !includesNormalized(vehicle.vehicleType, filters.vehicleType)) return false
  if (filters.paymentStatus && !includesNormalized(vehicle.paymentStatus, filters.paymentStatus)) return false
  if (filters.delivery && !includesNormalized(vehicle.delivery, filters.delivery)) return false
  return true
}

export default function VehiclesPage() {
  const { data, isLoading, isError, error } = useVehicles()
  const { data: currentUser } = useCurrentUser()
  const isOwner = currentUser?.role === "owner"
  const updateVehicle = useUpdateVehicle()
  const deleteVehicle = useDeleteVehicle()

  const [filters, setFilters] = useState<VehicleListFilters>(defaultVehicleListFilters)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter((vehicle) => matchesFilters(vehicle, filters))
  }, [data, filters])

  function handleUpdateField(id: number, field: keyof Vehicle, value: string) {
    updateVehicle.mutate({ id, data: { [field]: value } })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <VehicleFilters filters={filters} onChange={setFilters} />
        {isOwner && (
          <Button render={<Link href="/vehicles/new" />} nativeButton={false}>
            <PlusCircle className="mr-2 size-4" />
            Добавить технику
          </Button>
        )}
      </div>

      {isError ? (
        <p className="text-sm text-destructive">Не удалось загрузить технику: {error.message}</p>
      ) : isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <VehicleTable
          vehicles={filtered}
          onUpdateField={handleUpdateField}
          onDelete={(id) => setPendingDeleteId(id)}
        />
      )}

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить технику?</AlertDialogTitle>
            <AlertDialogDescription>
              Действие необратимо. Запись будет удалена из базы данных.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDeleteId !== null) deleteVehicle.mutate(pendingDeleteId)
                setPendingDeleteId(null)
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
