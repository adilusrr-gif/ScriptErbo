"use client"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

interface QuickEditSelectProps {
  value: string
  options: readonly string[]
  badgeVariant?: Record<string, "default" | "secondary" | "destructive" | "outline">
  onChange: (value: string) => void
  disabled?: boolean
}

export function QuickEditSelect({
  value,
  options,
  badgeVariant,
  onChange,
  disabled,
}: QuickEditSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)} disabled={disabled}>
      <SelectTrigger
        size="sm"
        className="h-7 w-auto border-none bg-transparent px-1 shadow-none focus-visible:ring-1"
        onClick={(e) => e.stopPropagation()}
      >
        {badgeVariant ? (
          <Badge variant={badgeVariant[value] ?? "outline"}>{value || "—"}</Badge>
        ) : (
          <span>{value || "—"}</span>
        )}
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
