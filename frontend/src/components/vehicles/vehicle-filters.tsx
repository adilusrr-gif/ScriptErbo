"use client"

import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DELIVERY_STATUS, PAYMENT_STATUS, VEHICLE_STATUS, VEHICLE_TYPES } from "@/lib/constants"

export interface VehicleListFilters {
  search: string
  status: string
  vehicleType: string
  paymentStatus: string
  delivery: string
}

export const defaultVehicleListFilters: VehicleListFilters = {
  search: "",
  status: "all",
  vehicleType: "all",
  paymentStatus: "all",
  delivery: "all",
}

interface VehicleFiltersProps {
  filters: VehicleListFilters
  onChange: (filters: VehicleListFilters) => void
}

export function VehicleFilters({ filters, onChange }: VehicleFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.vehicleType !== "all" ||
    filters.paymentStatus !== "all" ||
    filters.delivery !== "all"

  function set<K extends keyof VehicleListFilters>(key: K, value: VehicleListFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  function setIfPresent<K extends keyof VehicleListFilters>(key: K, value: string | null) {
    if (value) set(key, value as VehicleListFilters[K])
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

      <Select value={filters.vehicleType} onValueChange={(v) => setIfPresent("vehicleType", v)}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Вид техники" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все виды</SelectItem>
          {VEHICLE_TYPES.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => setIfPresent("status", v)}>
        <SelectTrigger className="w-40"><SelectValue placeholder="Статус" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          {VEHICLE_STATUS.map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.paymentStatus} onValueChange={(v) => setIfPresent("paymentStatus", v)}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Статус оплаты" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Любая оплата</SelectItem>
          {PAYMENT_STATUS.map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.delivery} onValueChange={(v) => setIfPresent("delivery", v)}>
        <SelectTrigger className="w-44"><SelectValue placeholder="Доставка" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Любая доставка</SelectItem>
          {DELIVERY_STATUS.map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>

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
