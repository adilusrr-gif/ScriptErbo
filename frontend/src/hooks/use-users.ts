import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiClient } from "@/lib/api-client"
import type { Role } from "@/lib/auth/session"

export interface ManagedUser {
  id: number
  email: string
  name: string
  role: Role
  createdAt: string
}

interface NewUserInput {
  email: string
  password: string
  name: string
  role: Role
}

const usersKey = ["users"] as const

export function useUsers() {
  return useQuery({
    queryKey: usersKey,
    queryFn: () => apiClient.get<ManagedUser[]>("users"),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewUserInput) => apiClient.post<ManagedUser>("users", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKey })
      toast.success("Пользователь создан")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => apiClient.delete<{ id: number }>(`users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKey })
      toast.success("Пользователь удалён")
    },
    onError: (error: Error) => toast.error(error.message),
  })
}
