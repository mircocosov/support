// src/api/hooks/useApi.ts
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/api/config/apiConfig'

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false)

  const sendRequest = async <T>(config: {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    headers?: Record<string, string>
  }) => {
    setIsLoading(true)
    try {
      const fullUrl = `${API_BASE_URL}${config.url}`
      console.log('Sending request to:', fullUrl, 'with data:', config.data)

      const response = await axios({
        url: fullUrl,
        method: config.method,
        data: config.data,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...config.headers,
        },
      })

      console.log('Response received:', response.data)
      return response.data as T
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config,
        })

        throw {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          response: error.response,
          data: error.response?.data,
        }
      }
      console.error('Unknown error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { sendRequest, isLoading }
}
