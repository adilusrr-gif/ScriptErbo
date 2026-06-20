"use client"

import { usePathname } from "next/navigation"

import { navItems } from "@/lib/nav-items"
import { MobileNav } from "@/components/layout/mobile-nav"

function pageTitle(pathname: string) {
  const exact = navItems.find((item) => item.href === pathname)
  if (exact) return exact.title
  if (pathname.startsWith("/vehicles/new")) return "Добавить технику"
  if (pathname.startsWith("/vehicles/")) return "Карточка техники"
  if (pathname.startsWith("/vehicles")) return "Остатки техники"
  const match = navItems.find((item) => pathname.startsWith(item.href) && item.href !== "/")
  return match?.title ?? "ScriptErbo"
}

export function Header() {
  const pathname = usePathname()

  return (
    <header className="flex h-16 items-center gap-3 border-b bg-background px-4 md:px-6">
      <MobileNav />
      <h1 className="text-lg font-semibold">{pageTitle(pathname)}</h1>
    </header>
  )
}
