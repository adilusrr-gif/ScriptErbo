"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { LayoutGrid, Search, Table2 } from "lucide-react"

import { useDeleteVehicle, useUpdateVehicle, useVehicles } from "@/hooks/use-vehicles"
import { VehicleTable } from "@/components/vehicles/vehicle-table"
import { DeliveryPipeline } from "@/components/delivery/delivery-pipeline"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DELIVERY_OPTIONS, deliveryStageIndex } from "@/lib/constants"
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
import type { Vehicle } from "@/types/vehicle"

function ShipmentCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/vehicles/${vehicle.id}`} className="font-medium hover:underline">
            {vehicle.vehicleType} {vehicle.model}
          </Link>
          <span className="text-xs text-muted-foreground">№{vehicle.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <DeliveryPipeline value={vehicle.delivery} compact />
          {deliveryStageIndex(vehicle.delivery) !== null && (
            <Badge variant="outline" className="shrink-0">
              {DELIVERY_OPTIONS[deliveryStageIndex(vehicle.delivery)!]}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>
            <div className="text-xs">Перевозчик</div>
            <div className="text-foreground">{vehicle.carrier || "—"}</div>
          </div>
          <div>
            <div className="text-xs">Маршрут</div>
            <div className="text-foreground">{vehicle.route || "—"}</div>
          </div>
          <div>
            <div className="text-xs">Менеджер</div>
            <div className="text-foreground">{vehicle.manager || "—"}</div>
          </div>
          <div>
            <div className="text-xs">Компания</div>
            <div className="text-foreground">{vehicle.company || "—"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DeliveryPage() {
  const { data, isLoading, isError, error } = useVehicles()
  const updateVehicle = useUpdateVehicle()
  const deleteVehicle = useDeleteVehicle()
  const [search, setSearch] = useState("")
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [view, setView] = useState<"cards" | "table">("cards")

  const shipments = useMemo(() => {
    if (!data) return []
    const query = search.trim().toLowerCase()
    return data.filter((vehicle) => {
      if (!vehicle.delivery && !vehicle.carrier && !vehicle.route) return false
      if (!query) return true
      return [vehicle.delivery, vehicle.carrier, vehicle.route]
        .map(toText)
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по доставке, перевозчику, маршруту..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-1">
          <Button
            variant={view === "cards" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("cards")}
            aria-label="Карточки"
          >
            <LayoutGrid className="size-4" />
          </Button>
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("table")}
            aria-label="Таблица"
          >
            <Table2 className="size-4" />
          </Button>
        </div>
      </div>

      {isError ? (
        <p className="text-sm text-destructive">Не удалось загрузить доставки: {error.message}</p>
      ) : isLoading ? (
        <Skeleton className="h-96" />
      ) : shipments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Нет доставок по текущему запросу</p>
      ) : view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shipments.map((vehicle) => (
            <ShipmentCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
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
