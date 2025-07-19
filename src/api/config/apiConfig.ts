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
      resetPasswordConfirm: string
      me: string
    }
    tickets: {
      list: string
      create: string
      detail: (id: number) => string
      categories: string
      comments: (ticketId: number) => string
    }
    admin: {
      createCategories: string
      updateCategories: (id: number) => string
      deleteCategories: (id: number) => string
      getCategories: string
      ticketHistory: string
      users: string
      updateUser: (id: number) => string
    }
    notifications: {
      list: string
      markAsRead: (id: number) => string
    }
    support: {
      tickets: string
      ticketById: (id: number) => string
      assign: (id: number) => string
      status: (id: number) => string
    }
    users: {
      me: string
      register: string
      resetPassword: string
      resetPasswordConfirm: string
    }
  }
}

const apiConfig: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  endpoints: {
    auth: {
      login: '/api/v1/auth/login/',
      logout: '/api/v1/auth/logout/',
      refresh: '/api/v1/auth/jwt/refresh/',
      verify: '/api/v1/auth/jwt/verify/',
      register: '/api/v1/users/register/',
      forgotPassword: '/api/v1/users/reset-password/',
      resetPasswordConfirm: '/api/v1/users/reset-password-confirm/',
      me: '/api/v1/users/me/',
    },
    tickets: {
      list: '/api/v1/tickets/', // Эндпоинт для обычных пользователей
      create: '/api/v1/tickets/',
      detail: (id) => `/api/v1/tickets/${id}/`,
      categories: '/api/v1/tickets/categories/',
      comments: (ticketId) => `/api/v1/tickets/${ticketId}/comments/`,
    },
    admin: {
      createCategories: '/api/v1/admin/categories/',
      updateCategories: (id) => `/api/v1/admin/categories/${id}/`,
      deleteCategories: (id) => `/api/v1/admin/categories/${id}/`,
      getCategories: '/api/v1/admin/categories/',
      ticketHistory: '/api/v1/admin/tickets/history/',
      users: '/api/v1/admin/users/',
      updateUser: (id) => `/api/v1/admin/users/${id}/role/`,
    },
    notifications: {
      list: '/api/v1/notifications/',
      markAsRead: (id) => `/api/v1/notifications/${id}/mark-as-read/`,
    },
    support: {
      tickets: '/api/v1/support/tickets/', // Эндпоинт для админов и саппорта
      ticketById: (id) => `/api/v1/support/tickets/${id}/`,
      assign: (id) => `/api/v1/support/tickets/${id}/assign/`,
      status: (id) => `/api/v1/support/tickets/${id}/status/`,
    },
    users: {
      me: '/api/v1/users/me/',
      register: '/api/v1/users/register/',
      resetPassword: '/api/v1/users/reset-password/',
      resetPasswordConfirm: '/api/v1/users/reset-password-confirm/',
    },
  },
}

export const API_BASE_URL = apiConfig.baseUrl
export const API_ENDPOINTS = apiConfig.endpoints
