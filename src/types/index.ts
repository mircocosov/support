export * from './auth'
export * from './ticket'
export type { Category, TicketHistory, User, UserRoleUpdate } from './admin'
export { ApiError } from './api'

export interface Notification {
  id: number
  message: string
  is_read: boolean
  created_at: string
}
