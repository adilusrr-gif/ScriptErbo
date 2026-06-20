import type { ApiResponse } from "@/types/api"

const BASE_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? ""

class ApiClientError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiClientError"
  }
}

function assertBaseUrl() {
  if (!BASE_URL) {
    throw new ApiClientError(
      "NEXT_PUBLIC_APPS_SCRIPT_URL не задан. Укажите URL Apps Script Web App в .env.local"
    )
  }
}

function buildUrl(route: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(BASE_URL)
  url.searchParams.set("route", route)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

async function unwrap<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new ApiClientError(`Сетевая ошибка: ${res.status} ${res.statusText}`)
  }
  const json = (await res.json()) as ApiResponse<T>
  if (!json.success) {
    throw new ApiClientError(json.error || "Неизвестная ошибка API")
  }
  return json.data
}

async function apiGet<T>(
  route: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  assertBaseUrl()
  const res = await fetch(buildUrl(route, params), { method: "GET" })
  return unwrap<T>(res)
}

/**
 * POST body is sent with Content-Type text/plain to keep the request a CORS
 * "simple request" — Apps Script Web Apps cannot answer OPTIONS preflights,
 * so application/json would otherwise break cross-origin calls.
 */
async function apiPost<T>(route: string, payload: unknown): Promise<T> {
  assertBaseUrl()
  const res = await fetch(buildUrl(route), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  })
  return unwrap<T>(res)
}

export const apiClient = {
  get: apiGet,
  post: apiPost,
}

export { ApiClientError }
