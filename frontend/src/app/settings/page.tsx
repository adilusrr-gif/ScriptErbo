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
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle")

  async function testConnection() {
    setChecking(true)
    try {
      await vehicleApi.dashboard()
      setStatus("ok")
      toast.success("Соединение с базой данных установлено")
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
          <CardTitle>Подключение к базе данных</CardTitle>
          <CardDescription>
            Приложение хранит и читает все данные через собственный API
            (Next.js Route Handlers) поверх Postgres.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Button onClick={testConnection} disabled={checking}>
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
          <p>Backend: Next.js Route Handlers + Drizzle ORM + Postgres (Neon).</p>
        </CardContent>
      </Card>
    </div>
  )
}
