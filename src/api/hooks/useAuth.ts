import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { refreshToken, loginAPI, registerAPI, logoutAPI } from '@/types/auth'
import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig'
import {
  UserData,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from '@/types/auth'

export const useAuth = () => {
  const [user, setUser] = useState<UserData | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState({
    auth: false,
    action: false,
  })
  const [initialCheckDone, setInitialCheckDone] = useState(false)
  const navigate = useNavigate()

  // Сохраняем данные аутентификации
  const saveAuthData = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    setAccessToken(data.access)
    setUser(data.user)
  }

  // Очищаем данные аутентификации
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    setAccessToken(null)
  }, [])

  // Проверяем текущую аутентификацию
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setInitialCheckDone(true)
      return
    }

    try {
      setLoading((prev) => ({ ...prev, auth: true }))
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData: UserData = await response.json()
        setUser(userData)
        setAccessToken(token)
      } else {
        // Используем новую функцию refreshToken
        const newToken = await refreshToken()
        setAccessToken(newToken)
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error)
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }))
      setInitialCheckDone(true)
    }
  }, [])

  // Вход в систему
  const login = async (credentials: LoginCredentials, redirectPath = '/') => {
    try {
      setLoading((prev) => ({ ...prev, action: true }))
      // Используем новую функцию loginAPI
      const data = await loginAPI(credentials)
      saveAuthData(data)
      navigate(redirectPath)
      return data
    } catch (error) {
      console.error('Ошибка при входе:', error)
      throw error instanceof Error ? error : new Error('Ошибка входа')
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  // Регистрация
  const register = async (credentials: RegisterCredentials) => {
    try {
      setLoading((prev) => ({ ...prev, action: true }))
      // Используем новую функцию registerAPI
      const responseData = await registerAPI(credentials)
      return responseData
    } catch (error) {
      console.error('Ошибка при регистрации:', error)
      throw error instanceof Error ? error : new Error('Ошибка регистрации')
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  // Выход из системы
  const logout = async () => {
    try {
      // Используем новую функцию logoutAPI
      await logoutAPI(accessToken)
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    } finally {
      clearAuthData()
      navigate('/login')
    }
  }

  // Проверка роли
  const hasRole = (role: UserRole) => {
    return user?.role === role
  }

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    accessToken,
    isAuthenticated: !!user,
    loading: loading.auth || loading.action,
    initialCheckDone,
    login,
    logout,
    register,
    refreshToken, // Экспортируем функцию обновления токена
    hasRole,
    checkAuth,
  }
}
