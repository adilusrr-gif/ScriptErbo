"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Trash2 } from "lucide-react"

import { useDeleteVehicle, useUpdateVehicle, useVehicle } from "@/hooks/use-vehicles"
import { VehicleForm } from "@/components/vehicles/vehicle-form"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { VehicleFormValues } from "@/lib/validations/vehicle-schema"

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const router = useRouter()

  const { data: vehicle, isLoading, isError, error } = useVehicle(id)
  const updateVehicle = useUpdateVehicle()
  const deleteVehicle = useDeleteVehicle()
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleSubmit(values: VehicleFormValues) {
    updateVehicle.mutate({ id, data: values })
  }

  function handleDelete() {
    deleteVehicle.mutate(id, {
      onSuccess: () => router.push("/vehicles"),
    })
  }

  if (isError) {
    return <p className="text-sm text-destructive">Ошибка загрузки: {error.message}</p>
  }

  if (isLoading || !vehicle) {
    return <Skeleton className="h-96" />
  }

  const defaultValues: VehicleFormValues = vehicle

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          ID {vehicle.id} · обновлено{" "}
          {vehicle.updatedAt ? new Date(vehicle.updatedAt).toLocaleString("ru-RU") : "—"}
        </p>
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
            <Trash2 className="mr-2 size-4" />
            Удалить
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить технику?</AlertDialogTitle>
              <AlertDialogDescription>
                Действие необратимо. Запись будет удалена из Google Sheets.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <VehicleForm
        key={vehicle.id}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={updateVehicle.isPending}
        submitLabel="Сохранить"
      />
    </div>
  )
}
