"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Truck } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { navItems } from "@/lib/nav-items"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Truck className="size-5 text-primary" />
          <span className="font-semibold">ScriptErbo</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  )
}
