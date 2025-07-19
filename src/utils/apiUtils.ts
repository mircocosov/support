import { API_BASE_URL } from '@/api/config/apiConfig'

// Типы для API ответов
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

// Типы для пагинации
export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next?: string
  previous?: string
}

// Базовый запрос к API
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem('accessToken')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        error: data?.detail || data?.message || `HTTP ${response.status}`,
        status: response.status,
      }
    }

    return {
      data,
      status: response.status,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      status: 0,
    }
  }
}

// GET запрос
export const apiGet = <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'GET' })
}

// POST запрос
export const apiPost = <T = any>(
  endpoint: string,
  body: any
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// PUT запрос
export const apiPut = <T = any>(
  endpoint: string,
  body: any
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

// PATCH запрос
export const apiPatch = <T = any>(
  endpoint: string,
  body: any
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

// DELETE запрос
export const apiDelete = <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' })
}

// Загрузка файла
export const apiUploadFile = async (
  endpoint: string,
  formData: FormData
): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('accessToken')
    const headers: HeadersInit = {}

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        error: data?.detail || data?.message || `HTTP ${response.status}`,
        status: response.status,
      }
    }

    return {
      data,
      status: response.status,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      status: 0,
    }
  }
}

// Обработка ошибок API
export const handleApiError = (error: any): string => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.response?.data?.detail) {
    return error.response.data.detail
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'Произошла неизвестная ошибка'
} 