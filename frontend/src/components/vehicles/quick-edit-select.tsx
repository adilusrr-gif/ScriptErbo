"use client"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface QuickEditSelectProps {
  value: string
  onSave: (value: string) => void
  options: readonly string[]
  placeholder?: string
  badgeVariant?: (value: string) => "default" | "secondary" | "destructive" | "outline"
}

export function QuickEditSelect({
  value,
  onSave,
  options,
  placeholder,
  badgeVariant,
}: QuickEditSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => next !== null && next !== value && onSave(next)}>
      <SelectTrigger
        onClick={(e) => e.stopPropagation()}
        className="h-7 w-auto border-none bg-transparent px-1 shadow-none hover:bg-accent data-[popup-open]:bg-accent"
      >
        <SelectValue>
          {badgeVariant ? (
            <Badge variant={badgeVariant(value)}>{value || placeholder || "—"}</Badge>
          ) : (
            <span className={value ? "" : "text-muted-foreground"}>
              {value || placeholder || "—"}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">{placeholder || "—"}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
