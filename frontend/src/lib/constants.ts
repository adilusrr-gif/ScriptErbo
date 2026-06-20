export const VEHICLE_STATUS = ["Доступно", "Бронь", "Продано", "Ремонт"] as const

export const PAYMENT_STATUS = [
  "Ожидает оплаты",
  "Частично оплачено",
  "Оплачено",
] as const

export const DELIVERY_STATUS = ["Не отправлено", "В пути", "Доставлено"] as const

export const VEHICLE_TYPES = [
  "Грузовик",
  "Прицеп",
  "Спецтехника",
  "Автобус",
  "Легковой",
  "Другое",
] as const

export const STATUS_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Доступно": "default",
  "Бронь": "secondary",
  "Продано": "outline",
  "Ремонт": "destructive",
}

export const PAYMENT_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Ожидает оплаты": "destructive",
  "Частично оплачено": "secondary",
  "Оплачено": "default",
}

export const DELIVERY_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Не отправлено": "outline",
  "В пути": "secondary",
  "Доставлено": "default",
}
