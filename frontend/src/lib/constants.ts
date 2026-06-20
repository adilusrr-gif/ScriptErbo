// В реальной таблице статус/оплата/доставка — свободный текст с большим
// разбросом значений, поэтому здесь только подсказки для автодополнения,
// а не жёсткие enum.
export const STATUS_SUGGESTIONS = [
  "Доступен для продажи",
  "БРОНЬ",
  "Ремонт",
  "перемещение",
  "ИП",
  "офис",
]

export const PAYMENT_SUGGESTIONS = [
  "100%",
  "50%",
  "30%",
  "20%",
  "10%",
  "рассрочка",
  "предоплата",
]

export const DELIVERY_SUGGESTIONS = ["Доставлено", "В пути", "DDP"]

export const YES_NO_OPTIONS = ["", "да", "нет"] as const

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export function statusBadgeVariant(status: string): BadgeVariant {
  const value = (status || "").trim().toLowerCase()
  if (value.indexOf("досту") !== -1) return "default"
  if (value.indexOf("брон") !== -1) return "secondary"
  if (value.indexOf("ремонт") !== -1) return "destructive"
  return "outline"
}

export function paymentPercent(value: string): number | null {
  const match = String(value || "").match(/(\d+)\s*%/)
  return match ? Number(match[1]) : null
}

export function paymentBadgeVariant(value: string): BadgeVariant {
  const percent = paymentPercent(value)
  if (percent === null) return "outline"
  if (percent >= 100) return "default"
  if (percent > 0) return "secondary"
  return "destructive"
}
