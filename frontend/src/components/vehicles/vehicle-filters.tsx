"use client"

import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface VehicleListFilters {
  search: string
  status: string
  vehicleType: string
  paymentStatus: string
  delivery: string
}

export const defaultVehicleListFilters: VehicleListFilters = {
  search: "",
  status: "",
  vehicleType: "",
  paymentStatus: "",
  delivery: "",
}

interface VehicleFiltersProps {
  filters: VehicleListFilters
  onChange: (filters: VehicleListFilters) => void
}

export function VehicleFilters({ filters, onChange }: VehicleFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(Boolean)

  function set<K extends keyof VehicleListFilters>(key: K, value: VehicleListFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Поиск по марке, модели, VIN, договору..."
          className="pl-8"
        />
      </div>

      <Input
        value={filters.vehicleType}
        onChange={(e) => set("vehicleType", e.target.value)}
        placeholder="Вид техники"
        className="w-40"
      />
      <Input
        value={filters.status}
        onChange={(e) => set("status", e.target.value)}
        placeholder="Статус"
        className="w-40"
      />
      <Input
        value={filters.paymentStatus}
        onChange={(e) => set("paymentStatus", e.target.value)}
        placeholder="Статус оплаты"
        className="w-40"
      />
      <Input
        value={filters.delivery}
        onChange={(e) => set("delivery", e.target.value)}
        placeholder="Доставка"
        className="w-40"
      />

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(defaultVehicleListFilters)}
        >
          <X className="mr-1 size-4" />
          Сбросить
        </Button>
      )}
    </div>
  )
}
