import type { ApiResponse } from "@/types/api"

class ApiClientError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiClientError"
  }
}

function buildUrl(route: string, params?: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        search.set(key, String(value))
      }
    }
  }
  const query = search.toString()
  return `/api/${route}${query ? `?${query}` : ""}`
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
  const res = await fetch(buildUrl(route, params), { method: "GET" })
  return unwrap<T>(res)
}

async function apiPost<T>(route: string, payload: unknown): Promise<T> {
  const res = await fetch(buildUrl(route), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  return unwrap<T>(res)
}

export const apiClient = {
  get: apiGet,
  post: apiPost,
}

export { ApiClientError }
