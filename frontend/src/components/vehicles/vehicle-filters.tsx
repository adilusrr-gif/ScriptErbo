"use client"

import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STATUS_OPTIONS } from "@/lib/constants"

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

const FILTER_LABELS: Record<keyof VehicleListFilters, string> = {
  search: "Поиск",
  status: "Статус",
  vehicleType: "Вид техники",
  paymentStatus: "Оплата",
  delivery: "Доставка",
}

interface VehicleFiltersProps {
  filters: VehicleListFilters
  onChange: (filters: VehicleListFilters) => void
}

export function VehicleFilters({ filters, onChange }: VehicleFiltersProps) {
  const activeEntries = (Object.entries(filters) as [keyof VehicleListFilters, string][]).filter(
    ([, value]) => value
  )

  function set<K extends keyof VehicleListFilters>(key: K, value: VehicleListFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-2 rounded-lg border bg-card p-3 shadow-sm">
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
        <Select value={filters.status} onValueChange={(value) => set("status", value ?? "")}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Статус" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все статусы</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      </div>

      {activeEntries.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t pt-2">
          {activeEntries.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="gap-1 pr-1">
              <span className="text-muted-foreground">{FILTER_LABELS[key]}:</span> {value}
              <button
                type="button"
                onClick={() => set(key, "")}
                className="ml-0.5 rounded-full p-0.5 hover:bg-background/60"
                aria-label={`Убрать фильтр ${FILTER_LABELS[key]}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultVehicleListFilters)}
          >
            Сбросить всё
          </Button>
        </div>
      )}
    </div>
  )
}
