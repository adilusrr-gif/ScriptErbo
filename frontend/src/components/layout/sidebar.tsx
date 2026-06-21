"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Truck } from "lucide-react"

import { cn } from "@/lib/utils"
import { navItems } from "@/lib/nav-items"
import { useCurrentUser } from "@/hooks/use-current-user"
import { UserMenu } from "@/components/layout/user-menu"

export function Sidebar() {
  const pathname = usePathname()
  const { data: user } = useCurrentUser()

  const visibleItems = navItems.filter((item) => !item.ownerOnly || user?.role === "owner")

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Truck className="size-5 text-primary" />
        <span className="font-semibold">ScriptErbo</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <UserMenu />
    </aside>
  )
}
