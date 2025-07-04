type ApiConfig = {
  baseUrl: string
  endpoints: {
    auth: {
      login: string
      logout: string
      refresh: string
      verify: string
      register: string
      forgitPassword: string
      me: string
    }
  }
}

const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  endpoints: {
    auth: {
      login: '/api/v1/auth/login/',
      logout: '/api/v1/auth/logout/',
      refresh: '/api/v1/auth/refresh/',
      verify: '/api/v1/auth/verify/',
      register: '/api/v1/users/register/',
      forgitPassword: '/api/v1/users/reset-password/',
      me: '/api/v1/users/me/',
    },
  },
}

export const API_BASE_URL = apiConfig.baseUrl
export const API_ENDPOINTS = apiConfig.endpoints
