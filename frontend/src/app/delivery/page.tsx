"use client"

import { useMemo, useState } from "react"

import { useDeleteVehicle, useUpdateVehicle, useVehicles } from "@/hooks/use-vehicles"
import { VehicleTable } from "@/components/vehicles/vehicle-table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { DELIVERY_STATUS } from "@/lib/constants"
import type { Vehicle } from "@/types/vehicle"

export default function DeliveryPage() {
  const { data, isLoading, isError, error } = useVehicles()
  const updateVehicle = useUpdateVehicle()
  const deleteVehicle = useDeleteVehicle()
  const [delivery, setDelivery] = useState("all")
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const shipments = useMemo(() => {
    if (!data) return []
    return data.filter((vehicle) => {
      if (delivery !== "all") return vehicle.delivery === delivery
      return vehicle.delivery !== ""
    })
  }, [data, delivery])

  function handleUpdateField(id: number, field: keyof Vehicle, value: string) {
    updateVehicle.mutate({ id, data: { [field]: value } })
  }

  return (
    <div className="space-y-4">
      <Select value={delivery} onValueChange={(value) => value && setDelivery(value)}>
        <SelectTrigger className="w-48"><SelectValue placeholder="Статус доставки" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все отправленные</SelectItem>
          {DELIVERY_STATUS.map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isError ? (
        <p className="text-sm text-destructive">Не удалось загрузить доставки: {error.message}</p>
      ) : isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <VehicleTable
          vehicles={shipments}
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
