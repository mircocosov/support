import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios'
import { API_BASE_URL } from '@/api/config/apiConfig'
import { refreshToken } from '@/types/auth'
import { ApiError } from '@/types'

// Создаем кастомный интерфейс для расширения конфигурации Axios
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

// Создаем экземпляр Axios с базовой конфигурацией
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерцептор для добавления токена к запросам
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Интерцептор для обработки ошибок и обновления токенов
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    // Если ошибка 401 (Unauthorized) и запрос еще не перезапускался
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Пытаемся обновить токен
        const newAccessToken = await refreshToken()

        // Сохраняем новый токен
        localStorage.setItem('accessToken', newAccessToken)

        // Обновляем заголовок авторизации
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // Повторяем оригинальный запрос с новым токеном
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Не удалось обновить токен:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Функция-обертка для более удобной работы с API
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new ApiError(
        error.response?.data?.message || error.message,
        error.response?.status || 0,
        error.response?.data,
      )
    }
    throw error
  }
}

export default apiClient
