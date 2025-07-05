import { AxiosRequestConfig } from 'axios'

export interface ApiError {
  message: string
  status?: number
  data?: unknown
}

export interface UseApiReturn {
  sendRequest: <T = unknown>(config: AxiosRequestConfig) => Promise<T>
  loading: boolean
  error: ApiError | null
}
