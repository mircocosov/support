import { apiRequest } from '@/api/hooks'
import { API_ENDPOINTS } from '@/api/config/apiConfig'
import { Category, TicketHistory, User, UserRoleUpdate } from '@/types'

export const AdminService = {
  // Категории
  createCategory: (data: { name: string }) =>
    apiRequest<Category>({
      url: API_ENDPOINTS.tickets.categories,
      method: 'POST',
      data,
    }),

  updateCategory: (id: number, data: { name: string }) =>
    apiRequest<Category>({
      url: API_ENDPOINTS.tickets.categories,
      method: 'PATCH',
      data,
    }),

  deleteCategory: (id: number) =>
    apiRequest({
      url: API_ENDPOINTS.tickets.categories,
      method: 'DELETE',
    }),

  getCategories: () =>
    apiRequest<Category[]>({
      url: API_ENDPOINTS.tickets.categories,
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    }),

  // История тикетов
  getTicketHistory: () =>
    apiRequest<TicketHistory[]>({
      url: API_ENDPOINTS.admin.ticketHistory,
      method: 'GET',
    }),

  // Пользователи
  getUsers: (role?: User['role']) =>
    apiRequest<User[]>({
      url: `${API_ENDPOINTS.admin.users}?_=${Date.now()}`,
      method: 'GET',
      params: { role },
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
      },
    }),

  updateUserRole: (id: string, data: UserRoleUpdate) =>
    apiRequest<User>({
      url: API_ENDPOINTS.admin.updateUser(parseInt(id)),
      method: 'PATCH',
      data,
    }),
}
