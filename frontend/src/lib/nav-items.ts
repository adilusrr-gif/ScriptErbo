import {
  LayoutDashboard,
  Warehouse,
  PlusCircle,
  CalendarClock,
  Truck,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Остатки техники", href: "/vehicles", icon: Warehouse },
  { title: "Добавить технику", href: "/vehicles/new", icon: PlusCircle },
  { title: "Бронь", href: "/bookings", icon: CalendarClock },
  { title: "Доставка", href: "/delivery", icon: Truck },
  { title: "Статистика", href: "/stats", icon: BarChart3 },
  { title: "Настройки", href: "/settings", icon: Settings },
]
