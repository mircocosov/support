// src/api/config.ts
type ApiConfig = {
  baseUrl: string
  endpoints: {
    auth: {
      login: string
      logout: string
      refresh: string
      verify: string
      register: string
      forgotPassword: string
      me: string
    }
    tickets: {
      list: string
      create: string
      detail: (id: number) => string
      categories: string
      comments: (ticketId: number) => string
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
      forgotPassword: '/api/v1/users/reset-password/',
      me: '/api/v1/users/me/',
    },
    tickets: {
      list: '/api/v1/tickets/',
      create: '/api/v1/tickets/',
      detail: (id) => `/api/v1/tickets/${id}/`,
      categories: '/api/v1/tickets/categories/',
      comments: (ticketId) => `/api/v1/tickets/${ticketId}/comments/`,
    },
  },
}

export const API_BASE_URL = apiConfig.baseUrl
export const API_ENDPOINTS = apiConfig.endpoints
