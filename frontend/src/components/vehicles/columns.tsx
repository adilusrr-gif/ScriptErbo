"use client"

import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { QuickEditText } from "@/components/vehicles/quick-edit-text"
import { paymentBadgeVariant, statusBadgeVariant } from "@/lib/constants"
import type { Vehicle } from "@/types/vehicle"

interface ColumnActions {
  onUpdateField: (id: number, field: keyof Vehicle, value: string) => void
  onDelete: (id: number) => void
  isOwner: boolean
}

interface SortableColumn {
  toggleSorting: (desc?: boolean) => void
  getIsSorted: () => false | "asc" | "desc"
}

function SortableHeader({ label, column }: { label: string; column: SortableColumn }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 size-3.5" />
    </Button>
  )
}

function sortableHeader(label: string) {
  function Header({ column }: { column: SortableColumn }) {
    return <SortableHeader label={label} column={column} />
  }
  return Header
}

export function buildVehicleColumns({
  onUpdateField,
  onDelete,
  isOwner,
}: ColumnActions): ColumnDef<Vehicle>[] {
  return [
    {
      accessorKey: "id",
      header: sortableHeader("№"),
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.id}</span>,
      size: 60,
    },
    {
      accessorKey: "vehicleType",
      header: sortableHeader("Вид техники"),
      cell: ({ row }) => (
        <Link href={`/vehicles/${row.original.id}`} className="font-medium hover:underline">
          {row.original.vehicleType}
        </Link>
      ),
    },
    {
      accessorKey: "model",
      header: sortableHeader("Модель"),
    },
    {
      accessorKey: "year",
      header: sortableHeader("Год"),
    },
    {
      accessorKey: "vin",
      header: "VIN",
    },
    {
      accessorKey: "company",
      header: "Компания",
      cell: ({ row }) => (
        <QuickEditText
          value={row.original.company}
          placeholder="Не указана"
          onSave={(value) => onUpdateField(row.original.id, "company", value)}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => (
        <QuickEditText
          value={row.original.status}
          placeholder="Не указан"
          badgeVariant={statusBadgeVariant}
          onSave={(value) => onUpdateField(row.original.id, "status", value)}
        />
      ),
    },
    {
      accessorKey: "manager",
      header: "Менеджер",
      cell: ({ row }) =>
        isOwner ? (
          <QuickEditText
            value={row.original.manager}
            placeholder="Не назначен"
            onSave={(value) => onUpdateField(row.original.id, "manager", value)}
          />
        ) : (
          <span>{row.original.manager || "Не назначен"}</span>
        ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Оплата",
      cell: ({ row }) => (
        <QuickEditText
          value={row.original.paymentStatus}
          placeholder="Нет данных"
          badgeVariant={paymentBadgeVariant}
          onSave={(value) => onUpdateField(row.original.id, "paymentStatus", value)}
        />
      ),
    },
    {
      accessorKey: "arrivalDate",
      header: sortableHeader("Дата прибытия"),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7" />}>
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href={`/vehicles/${row.original.id}`} />}>
              <Eye className="mr-2 size-4" />
              Открыть карточку
            </DropdownMenuItem>
            {isOwner && (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(row.original.id)}
              >
                <Trash2 className="mr-2 size-4" />
                Удалить
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 40,
    },
  ]
}
