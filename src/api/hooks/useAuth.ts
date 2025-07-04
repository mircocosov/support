import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from './useApi'
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UserData,
} from '@/types/auth'
import { API_ENDPOINTS } from '@/api/config/apiConfig'
import axios from 'axios'

export const useAuth = () => {
  const { sendRequest, isLoading } = useApi()
  const navigate = useNavigate()
  const [user, setUser] = useState<UserData | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  const fetchCurrentUser = useCallback(async (): Promise<UserData | null> => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return null

      const response = await sendRequest<UserData>({
        url: API_ENDPOINTS.auth.me,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      return response
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.removeItem('access_token')
      }
      return null
    }
  }, [sendRequest])

  const getDefaultRoute = useCallback((role?: string): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'support':
      case 'supporter':
        return '/support/tickets'
      case 'user':
      default:
        return '/home'
    }
  }, [])

  const login = useCallback(
    async (
      credentials: LoginCredentials,
      redirectPath?: string,
    ): Promise<AuthResponse> => {
      setAuthLoading(true)
      try {
        const response = await sendRequest<AuthResponse>({
          url: API_ENDPOINTS.auth.login,
          method: 'POST',
          data: credentials,
        })

        localStorage.setItem('access_token', response.access)
        if (response.refresh) {
          localStorage.setItem('refresh_token', response.refresh)
        }

        const userData = response.user || (await fetchCurrentUser())
        setUser(userData)
        setInitialCheckDone(true)

        if (userData) {
          const targetPath = redirectPath || getDefaultRoute(userData.role)
          navigate(targetPath, { replace: true })
        }

        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed')
        throw err
      } finally {
        setAuthLoading(false)
      }
    },
    [sendRequest, fetchCurrentUser, navigate, getDefaultRoute],
  )

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<AuthResponse> => {
      setAuthLoading(true)
      try {
        const response = await sendRequest<AuthResponse>({
          url: API_ENDPOINTS.auth.register,
          method: 'POST',
          data: credentials,
        })
        return response
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed')
        throw err
      } finally {
        setAuthLoading(false)
      }
    },
    [sendRequest],
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      await sendRequest({
        url: API_ENDPOINTS.auth.logout,
        method: 'POST',
      })
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
      setInitialCheckDone(false)
      navigate('/login', { replace: true })
    }
  }, [sendRequest, navigate])

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.role === role
    },
    [user],
  )

  const redirectByRole = useCallback(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    navigate(getDefaultRoute(user.role), { replace: true })
  }, [user, navigate, getDefaultRoute])

  useEffect(() => {
    if (initialCheckDone) return

    const checkAuth = async () => {
      setAuthLoading(true)
      try {
        const userData = await fetchCurrentUser()
        setUser(userData)
      } catch (err) {
        console.error('Auth check failed:', err)
      } finally {
        setAuthLoading(false)
        setInitialCheckDone(true)
      }
    }

    checkAuth()
  }, [fetchCurrentUser, initialCheckDone])

  return useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      hasRole,
      redirectByRole,
      loading: isLoading || authLoading,
      error,
      isAuthenticated: !!user,
      initialCheckDone,
      refreshUser: fetchCurrentUser,
    }),
    [
      user,
      login,
      register,
      logout,
      hasRole,
      redirectByRole,
      isLoading,
      authLoading,
      error,
      initialCheckDone,
      fetchCurrentUser,
    ],
  )
}
