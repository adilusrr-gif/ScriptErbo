"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { REPORT_SECTIONS, ALL_REPORT_SECTION_IDS, type ReportSectionId } from "@/lib/pdf/report-sections"

export function ExportPdfButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<ReportSectionId>>(new Set(ALL_REPORT_SECTION_IDS))

  function toggle(id: ReportSectionId, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }

  async function handleExport() {
    if (selected.size === 0) {
      toast.error("Выберите хотя бы один раздел отчёта")
      return
    }
    setLoading(true)
    try {
      const query = `?sections=${Array.from(selected).join(",")}`
      const res = await fetch(`/api/export/pdf${query}`)
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error || "Не удалось сформировать отчёт")
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `scripterbo-report-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось сформировать отчёт")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <FileDown />
        Скачать PDF-отчёт
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Что включить в отчёт?</DialogTitle>
          <DialogDescription>Отметьте разделы, которые нужны в PDF.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {REPORT_SECTIONS.map((section) => (
            <div key={section.id} className="flex items-center gap-2">
              <Checkbox
                id={`section-${section.id}`}
                checked={selected.has(section.id)}
                onCheckedChange={(checked) => toggle(section.id, checked === true)}
              />
              <Label htmlFor={`section-${section.id}`} className="cursor-pointer font-normal">
                {section.label}
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <FileDown />}
            Скачать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
