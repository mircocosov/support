import { AxiosRequestConfig } from 'axios'

interface ApiError {
  message: string
  status?: number
  data?: unknown
}

interface UseApiReturn {
  sendRequest: <T = unknown>(config: AxiosRequestConfig) => Promise<T>
  loading: boolean
  error: ApiError | null
}

export type { ApiError, UseApiReturn }
