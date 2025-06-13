import { useState, useCallback } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../config/apiConfig'
import type { ApiError, UseApiReturn } from '@/types/api'

export const useApi = (): UseApiReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const sendRequest = useCallback(
    async <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
      setLoading(true)
      setError(null)

      try {
        const response = await axios({
          baseURL: API_BASE_URL,
          ...config,
        })
        return response.data
      } catch (err) {
        const error = err as {
          response?: { status?: number; data?: unknown }
          message: string
        }
        const errorData: ApiError = {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        }
        setError(errorData)
        throw errorData
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { sendRequest, loading, error }
}
