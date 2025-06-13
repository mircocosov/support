// Типы для конфигурации API
type ApiConfig = {
  baseUrl: string
  endpoints: {
    auth: {
      login: string
      logout: string
      refresh: string
      verify: string
    }
    tickets: {
      list: string
      create: string
      detail: (id: string | number) => string
      assign: (id: string | number) => string
      comments: (id: string | number) => string
      updateStatus: (id: string | number) => string
    }
  }
}

// Конфигурация API
const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/jwt/refresh',
      verify: '/auth/jwt/verify',
    },
    tickets: {
      list: '/tickets',
      create: '/tickets',
      detail: (id) => `/tickets/${id}`,
      assign: (id) => `/tickets/${id}/assign`,
      comments: (id) => `/tickets/${id}/comments`,
      updateStatus: (id) => `/tickets/${id}/update_status`,
    },
  },
}

// Экспорт конфигурации
export const API_BASE_URL = apiConfig.baseUrl
export const API_ENDPOINTS = apiConfig.endpoints
