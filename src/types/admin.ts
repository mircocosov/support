export interface Category {
  id: number
  name: string
}

export interface TicketHistory {
  id: number
  ticket_id: number
  changed_by: number
  change_type: string
  changed_at: string
  old_value: string
  new_value: string
}

export interface User {
  id: string
  username: string
  email: string
  role: 'user' | 'admin' | 'support'
}

export interface UserRoleUpdate {
  role: User['role']
}

export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}
