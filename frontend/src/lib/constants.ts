import { toText } from "@/lib/utils"

export const STATUS_OPTIONS = [
  "Доступен для продажи",
  "Забронирован",
  "в аренде",
  "в ремонте",
  "продан",
] as const

export const PAYMENT_SUGGESTIONS = [
  "100%",
  "50%",
  "30%",
  "20%",
  "10%",
  "рассрочка",
  "предоплата",
]

export const DELIVERY_OPTIONS = [
  "Готово к отправке",
  "Забрано",
  "В пути",
  "Доставлено",
] as const

/** Индекс стадии доставки (0..3) для визуальной дорожки. null — значение
 *  не из фиксированного списка (старые данные, свободный текст) — в этом
 *  случае дорожку не рисуем, показываем исходный текст как есть. */
export function deliveryStageIndex(value: unknown): number | null {
  const text = toText(value).trim()
  const index = DELIVERY_OPTIONS.findIndex((option) => option === text)
  return index === -1 ? null : index
}

export const YES_NO_OPTIONS = ["да", "нет"] as const

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export function statusBadgeVariant(status: unknown): BadgeVariant {
  const value = toText(status).trim().toLowerCase()
  if (value.indexOf("досту") !== -1) return "default"
  if (value.indexOf("брон") !== -1) return "secondary"
  if (value.indexOf("аренд") !== -1) return "secondary"
  if (value.indexOf("ремонт") !== -1) return "destructive"
  if (value.indexOf("продан") !== -1) return "outline"
  return "outline"
}

/** Цвет акцентной полосы по статусу — параллельно statusBadgeVariant, но
 *  даёт более широкую палитру (chart-1..5) для полос/свечений в карточках
 *  и строках таблицы, а не только 4 варианта бейджа. */
export function statusAccentColor(status: unknown): string {
  const value = toText(status).trim().toLowerCase()
  if (value.indexOf("досту") !== -1) return "var(--chart-1)"
  if (value.indexOf("брон") !== -1) return "var(--chart-2)"
  if (value.indexOf("аренд") !== -1) return "var(--chart-2)"
  if (value.indexOf("ремонт") !== -1) return "var(--chart-4)"
  if (value.indexOf("продан") !== -1) return "var(--chart-5)"
  return "var(--border)"
}

export function paymentPercent(value: unknown): number | null {
  const match = toText(value).match(/(\d+)\s*%/)
  return match ? Number(match[1]) : null
}

export function paymentBadgeVariant(value: unknown): BadgeVariant {
  const percent = paymentPercent(value)
  if (percent === null) return "outline"
  if (percent >= 100) return "default"
  if (percent > 0) return "secondary"
  return "destructive"
}
