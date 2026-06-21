import { NextResponse } from "next/server"

export function success<T>(data: T) {
  return NextResponse.json({ success: true, data })
}

export function failure(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return NextResponse.json({ success: false, error: message })
}
