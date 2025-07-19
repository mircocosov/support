import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig'
import { ApiError } from '@/types'

export type UserRole = 'admin' | 'support' | 'user'

export interface UserData {
  id: string
  username: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  access: string
  refresh: string
  user: UserData
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  re_password: string
}

// Обновление токена доступа
export const refreshToken = async (): Promise<string> => {
  const refresh = localStorage.getItem('refreshToken')
  if (!refresh) {
    throw new Error('Refresh token отсутствует')
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.auth.refresh}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new ApiError(
        `Ошибка обновления токена: ${response.status} ${errorText}`,
        response.status,
        errorText,
      )
    }

    const data: { access: string } = await response.json()
    localStorage.setItem('accessToken', data.access)
    return data.access
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error)
    throw error
  }
}

// Вход в систему
export const loginAPI = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(
      response.status === 401
        ? 'Неверные учетные данные'
        : `Ошибка входа: ${response.status} ${errorText}`,
      response.status,
      errorText,
    )
  }

  return await response.json()
}

// Регистрация
export const registerAPI = async (
  credentials: RegisterCredentials,
): Promise<any> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.auth.register}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    },
  )

  const responseText = await response.text()
  let responseData: any

  try {
    responseData = JSON.parse(responseText)
  } catch {
    responseData = responseText
  }

  if (!response.ok) {
    let errorMessage = 'Ошибка регистрации'

    if (typeof responseData === 'object' && responseData !== null) {
      if ('detail' in responseData) {
        errorMessage = String(responseData.detail)
      } else if ('non_field_errors' in responseData) {
        const errors = responseData.non_field_errors as string[]
        errorMessage = errors.join(', ')
      } else {
        const fieldErrors = Object.entries(responseData)
          .filter(([, value]) => Array.isArray(value))
          .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)

        if (fieldErrors.length > 0) {
          errorMessage = fieldErrors.join('; ')
        }
      }
    } else if (typeof responseData === 'string') {
      errorMessage = responseData
    }

    throw new ApiError(errorMessage, response.status, responseData)
  }

  return responseData
}

// Выход из системы
export const logoutAPI = async (accessToken: string | null): Promise<void> => {
  const refresh = localStorage.getItem('refreshToken')
  if (!accessToken || !refresh) return

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Ошибка выхода: ${response.status} ${errorText}`)
  }
}
