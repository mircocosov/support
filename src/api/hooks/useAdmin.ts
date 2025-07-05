import { apiRequest } from '@/api/hooks'
import { API_ENDPOINTS } from '@/api/config/apiConfig'
import { Category, TicketHistory, User, UserRoleUpdate } from '@/types'

export const AdminService = {
  // Категории
  createCategory: (data: { name: string }) =>
    apiRequest<Category>({
      url: API_ENDPOINTS.admin.createCategories,
      method: 'POST',
      data,
    }),

  updateCategory: (id: number, data: { name: string }) =>
    apiRequest<Category>({
      url: API_ENDPOINTS.admin.updateCategories(id),
      method: 'PATCH',
      data,
    }),

  deleteCategory: (id: number) =>
    apiRequest({
      url: API_ENDPOINTS.admin.deleteCategories(id),
      method: 'DELETE',
    }),

  getCategories: () =>
    apiRequest<Category[]>({
      url: API_ENDPOINTS.admin.getCategories,
      method: 'GET',
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
      url: API_ENDPOINTS.admin.users,
      method: 'GET',
      params: { role },
    }),

  updateUserRole: (id: string, data: UserRoleUpdate) =>
    apiRequest<User>({
      url: API_ENDPOINTS.admin.updateUser(parseInt(id)),
      method: 'PATCH',
      data,
    }),
}
