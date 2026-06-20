"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { vehicleApi } from "@/lib/vehicle-api"
import { ApiClientError } from "@/lib/api-client"

export default function SettingsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? ""
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle")

  async function testConnection() {
    setChecking(true)
    try {
      await vehicleApi.dashboard()
      setStatus("ok")
      toast.success("Соединение с Apps Script установлено")
    } catch (error) {
      setStatus("fail")
      toast.error(error instanceof ApiClientError ? error.message : "Не удалось подключиться")
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Подключение к Google Apps Script</CardTitle>
          <CardDescription>
            Приложение хранит и читает все данные через Apps Script Web App,
            который работает поверх Google Sheets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">NEXT_PUBLIC_APPS_SCRIPT_URL</p>
            <p className="break-all rounded-md bg-muted px-3 py-2 font-mono text-sm">
              {apiUrl || "не задан — добавьте переменную в .env.local"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={testConnection} disabled={checking || !apiUrl}>
              {checking ? "Проверка..." : "Проверить соединение"}
            </Button>
            {status === "ok" && (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="size-3.5" /> Подключено
              </Badge>
            )}
            {status === "fail" && (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="size-3.5" /> Ошибка
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>О приложении</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>ScriptErbo — учёт остатков техники.</p>
          <p>Frontend: Next.js 15 + React 19 + TypeScript + TailwindCSS.</p>
          <p>Backend: Google Apps Script (REST API) + Google Sheets как база данных.</p>
        </CardContent>
      </Card>
    </div>
  )
}
