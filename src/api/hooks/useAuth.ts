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
} from '@/types'

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
  const saveAuthData = useCallback((data: AuthResponse) => {
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
    }
    setAccessToken(data.access)
  }, [])

  // Очищаем данные аутентификации
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    setAccessToken(null)
  }, [])

  // Проверяем текущую аутентификацию
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user')

    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Ошибка парсинга данных пользователя:', e)
        localStorage.removeItem('user')
      }
    }

    if (!token) {
      setInitialCheckDone(true)
      return
    }

    try {
      setLoading((prev) => ({ ...prev, auth: true }))

      // Проверяем валидность токена
      const verifyResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.auth.verify}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        },
      )

      if (verifyResponse.ok) {
        setAccessToken(token)
        return
      }

      // Если токен невалиден, пробуем обновить
      const newToken = await refreshToken()
      setAccessToken(newToken)

      // После обновления токена запрашиваем данные пользователя
      const meResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.auth.me}`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        },
      )

      if (meResponse.ok) {
        const userData: UserData = await meResponse.json()
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error)
      clearAuthData()
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }))
      setInitialCheckDone(true)
    }
  }, [clearAuthData])

  // Вход в систему
  const login = useCallback(
    async (credentials: LoginCredentials, redirectPath = '/') => {
      try {
        setLoading((prev) => ({ ...prev, action: true }))
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
    },
    [navigate, saveAuthData],
  )

  // Регистрация
  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setLoading((prev) => ({ ...prev, action: true }))
      const responseData = await registerAPI(credentials)
      return responseData
    } catch (error) {
      console.error('Ошибка при регистрации:', error)
      throw error instanceof Error ? error : new Error('Ошибка регистрации')
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }, [])

  // Выход из системы
  const logout = useCallback(async () => {
    try {
      await logoutAPI(accessToken)
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    } finally {
      clearAuthData()
      navigate('/login')
    }
  }, [accessToken, clearAuthData, navigate])

  // Проверка роли
  const hasRole = useCallback(
    (role: UserRole) => {
      return user?.role === role
    },
    [user],
  )

  useEffect(() => {
    // Восстанавливаем состояние из localStorage
    const token = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user')

    if (token) setAccessToken(token)
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Ошибка парсинга данных пользователя:', e)
        localStorage.removeItem('user')
      }
    }

    checkAuth()
  }, [checkAuth])

  return {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    loading: loading.auth || loading.action,
    initialCheckDone,
    login,
    logout,
    register,
    refreshToken,
    hasRole,
    checkAuth,
  }
}
