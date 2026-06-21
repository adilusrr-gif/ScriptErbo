"use client"

import { useRouter } from "next/navigation"

import { useCreateVehicle } from "@/hooks/use-vehicles"
import { useCurrentUser } from "@/hooks/use-current-user"
import { VehicleForm } from "@/components/vehicles/vehicle-form"
import { Skeleton } from "@/components/ui/skeleton"
import { vehicleFormDefaults, type VehicleFormValues } from "@/lib/validations/vehicle-schema"

export default function NewVehiclePage() {
  const router = useRouter()
  const { data: currentUser, isLoading } = useCurrentUser()
  const createVehicle = useCreateVehicle()

  function handleSubmit(values: VehicleFormValues) {
    createVehicle.mutate(values, {
      onSuccess: (created) => router.push(`/vehicles/${created.id}`),
    })
  }

  if (isLoading) return <Skeleton className="h-96" />

  if (currentUser && currentUser.role !== "owner") {
    return (
      <p className="text-sm text-muted-foreground">
        Добавление техники доступно только владельцу.
      </p>
    )
  }

  return (
    <VehicleForm
      defaultValues={vehicleFormDefaults}
      onSubmit={handleSubmit}
      isSubmitting={createVehicle.isPending}
      submitLabel="Добавить технику"
    />
  )
}
