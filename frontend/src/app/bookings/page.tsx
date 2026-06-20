"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { useDeleteVehicle, useUpdateVehicle, useVehicles } from "@/hooks/use-vehicles"
import { VehicleTable } from "@/components/vehicles/vehicle-table"
import { Input } from "@/components/ui/input"
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
import type { Vehicle } from "@/types/vehicle"

export default function BookingsPage() {
  const { data, isLoading, isError, error } = useVehicles()
  const updateVehicle = useUpdateVehicle()
  const deleteVehicle = useDeleteVehicle()
  const [search, setSearch] = useState("")
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const bookings = useMemo(() => {
    if (!data) return []
    const query = search.trim().toLowerCase()
    return data.filter((vehicle) => {
      if (vehicle.status !== "Бронь") return false
      if (!query) return true
      return [vehicle.brand, vehicle.model, vehicle.buyerCompany, vehicle.contract]
        .join(" ")
        .toLowerCase()
        .includes(query)
    })
  }, [data, search])

  function handleUpdateField(id: number, field: keyof Vehicle, value: string) {
    updateVehicle.mutate({ id, data: { [field]: value } })
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по брони..."
          className="pl-8"
        />
      </div>

      {isError ? (
        <p className="text-sm text-destructive">Не удалось загрузить бронь: {error.message}</p>
      ) : isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <VehicleTable
          vehicles={bookings}
          onUpdateField={handleUpdateField}
          onDelete={(id) => setPendingDeleteId(id)}
        />
      )}

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить технику?</AlertDialogTitle>
            <AlertDialogDescription>
              Действие необратимо. Запись будет удалена из Google Sheets.
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
