import { AxiosRequestConfig } from 'axios'

export class ApiError extends Error {
  status?: number
  data?: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export interface UseApiReturn {
  sendRequest: <T = unknown>(config: AxiosRequestConfig) => Promise<T>
  loading: boolean
  error: ApiError | null
}
