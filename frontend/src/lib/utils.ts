import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Google Sheets иногда отдаёт текстовые поля (например VIN "0425") как
 * числа. API приводит их к строке, но на фронте лучше перестраховаться
 * перед .trim()/.toLowerCase(), особенно для legacy-данных.
 */
export function toText(value: unknown): string {
  return value === null || value === undefined ? "" : String(value)
}
