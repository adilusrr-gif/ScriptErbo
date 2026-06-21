import { NextResponse } from "next/server"

import { SESSION_COOKIE } from "@/lib/auth/session"

export async function POST() {
  const response = NextResponse.json({ success: true, data: null })
  response.cookies.delete(SESSION_COOKIE)
  return response
}
