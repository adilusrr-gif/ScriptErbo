"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { useCurrentUser } from "@/hooks/use-current-user"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const router = useRouter()
  const { data: user } = useCurrentUser()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  if (!user) return null

  return (
    <div className="flex items-center justify-between gap-2 border-t p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {user.role === "owner" ? "Владелец" : "Менеджер"}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0"
        onClick={handleLogout}
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}
