"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface QuickEditTextProps {
  value: string
  onSave: (value: string) => void
  placeholder?: string
}

export function QuickEditText({ value, onSave, placeholder }: QuickEditTextProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)

  function commit() {
    setOpen(false)
    if (draft !== value) onSave(draft)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setDraft(value)
      }}
    >
      <PopoverTrigger
        onClick={(e) => e.stopPropagation()}
        className="group flex items-center gap-1.5 rounded px-1 py-0.5 text-left hover:bg-accent"
      >
        <span className={value ? "" : "text-muted-foreground"}>
          {value || placeholder || "—"}
        </span>
        <Pencil className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
            if (e.key === "Escape") setOpen(false)
          }}
          onBlur={commit}
          placeholder={placeholder}
        />
      </PopoverContent>
    </Popover>
  )
}
