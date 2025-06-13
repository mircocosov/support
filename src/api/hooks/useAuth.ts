import { useCallback } from 'react'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '../config/apiConfig'
import type { AuthResponse, LoginCredentials, RefreshToken } from '@/types/auth'

export const useAuth = () => {
  const { sendRequest, loading, error } = useApi()

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      return sendRequest<AuthResponse>({
        url: API_ENDPOINTS.auth.login,
        method: 'POST',
        data: credentials,
      })
    },
    [sendRequest],
  )

  const logout = useCallback(
    async (token: RefreshToken): Promise<void> => {
      return sendRequest<void>({
        url: API_ENDPOINTS.auth.logout,
        method: 'POST',
        data: token,
      })
    },
    [sendRequest],
  )

  return { login, logout, loading, error }
}
