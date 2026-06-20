"use client"

import { useRouter } from "next/navigation"

import { useCreateVehicle } from "@/hooks/use-vehicles"
import { VehicleForm } from "@/components/vehicles/vehicle-form"
import { vehicleFormDefaults, type VehicleFormValues } from "@/lib/validations/vehicle-schema"

export default function NewVehiclePage() {
  const router = useRouter()
  const createVehicle = useCreateVehicle()

  function handleSubmit(values: VehicleFormValues) {
    createVehicle.mutate(values, {
      onSuccess: (created) => router.push(`/vehicles/${created.id}`),
    })
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
