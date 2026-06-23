"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { useDeleteVehicle, useUpdateVehicle, useVehicle } from "@/hooks/use-vehicles"
import { useCurrentUser } from "@/hooks/use-current-user"
import { VehicleForm } from "@/components/vehicles/vehicle-form"
import { VehicleSummary } from "@/components/vehicles/vehicle-summary"
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
  const { data: currentUser } = useCurrentUser()
  const isOwner = currentUser?.role === "owner"
  const updateVehicle = useUpdateVehicle()
  const deleteVehicle = useDeleteVehicle()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  function handleSubmit(values: VehicleFormValues) {
    updateVehicle.mutate({ id, data: values }, { onSuccess: () => setEditing(false) })
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
        <div className="flex gap-2">
          {editing ? (
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Отмена
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-2 size-4" />
              Редактировать
            </Button>
          )}
          {isOwner && (
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger render={<Button variant="destructive" size="sm" />}>
                <Trash2 className="mr-2 size-4" />
                Удалить
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить технику?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Действие необратимо. Запись будет удалена из базы данных.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {editing ? (
        <VehicleForm
          key={vehicle.id}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isSubmitting={updateVehicle.isPending}
          submitLabel="Сохранить"
        />
      ) : (
        <VehicleSummary vehicle={vehicle} />
      )}
    </div>
  )
}
