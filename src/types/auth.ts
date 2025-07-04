export type UserRole = 'admin' | 'support' | 'user'

export interface UserData {
  id: string
  username: string
  email?: string
  first_name?: string
  last_name?: string
  role: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user?: UserData
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email?: string
  password: string
  re_password?: string
}
