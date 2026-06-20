import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
