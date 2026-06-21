import {
  LayoutDashboard,
  Warehouse,
  PlusCircle,
  CalendarClock,
  Truck,
  BarChart3,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  ownerOnly?: boolean
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Остатки техники", href: "/vehicles", icon: Warehouse },
  { title: "Добавить технику", href: "/vehicles/new", icon: PlusCircle, ownerOnly: true },
  { title: "Бронь", href: "/bookings", icon: CalendarClock },
  { title: "Доставка", href: "/delivery", icon: Truck },
  { title: "Статистика", href: "/stats", icon: BarChart3 },
  { title: "Пользователи", href: "/users", icon: Users, ownerOnly: true },
  { title: "Настройки", href: "/settings", icon: Settings },
]
