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

    let parsedUser = null
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        parsedUser = JSON.parse(storedUser)
        if (!user || JSON.stringify(user) !== JSON.stringify(parsedUser)) {
          setUser(parsedUser)
        }
      } catch (e) {
        console.error('Ошибка парсинга данных пользователя:', e)
        localStorage.removeItem('user')
      }
    }

    if (!token) {
      if (!initialCheckDone) setInitialCheckDone(true)
      return
    }

    try {
      setLoading((prev) => ({ ...prev, auth: true }))
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
        if (!parsedUser) {
          const meResponse = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.auth.me}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          if (meResponse.ok) {
            const userData = await meResponse.json()
            if (!user || JSON.stringify(user) !== JSON.stringify(userData)) {
              setUser(userData)
            }
            localStorage.setItem('user', JSON.stringify(userData))
          } else {
            setUser(null)
            localStorage.removeItem('user')
          }
        }
        if (!initialCheckDone) setInitialCheckDone(true)
        return
      }
      const newToken = await refreshToken()
      setAccessToken(newToken)
      const meResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.auth.me}`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        },
      )
      if (meResponse.ok) {
        const userData = await meResponse.json()
        if (!user || JSON.stringify(user) !== JSON.stringify(userData)) {
          setUser(userData)
        }
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        setUser(null)
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error)
      clearAuthData()
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }))
      if (!initialCheckDone) setInitialCheckDone(true)
    }
  }, [clearAuthData, initialCheckDone, user])

  // Вход в систему
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading((prev) => ({ ...prev, action: true }))
        const data = await loginAPI(credentials)
        saveAuthData(data)
        // Если user не пришёл — получить его отдельно
        if (!data.user) {
          const meResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
            headers: { Authorization: `Bearer ${data.access}` }
          });
          if (meResponse.ok) {
            const userData = await meResponse.json();
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setInitialCheckDone(true);
          }
        } else {
          setInitialCheckDone(true);
        }
        // После логина всегда вызываем checkAuth для гарантии
        await checkAuth();
        return data
      } catch (error) {
        console.error('Ошибка при входе:', error)
        throw error instanceof Error ? error : new Error('Ошибка входа')
      } finally {
        setLoading((prev) => ({ ...prev, action: false }))
      }
    },
    [saveAuthData, checkAuth],
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
    checkAuth()
    // eslint-disable-next-line
  }, [])

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
