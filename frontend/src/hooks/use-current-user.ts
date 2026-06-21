import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"
import type { Role } from "@/lib/auth/session"

export interface CurrentUser {
  name: string
  email: string
  role: Role
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"] as const,
    queryFn: () => apiClient.get<CurrentUser>("auth/me"),
    staleTime: 5 * 60_000,
    retry: false,
  })
}
