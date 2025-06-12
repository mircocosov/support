export interface User {
  id: string
  name: string
  login: string
  email: string
  createdAt: string
}

export interface RegisterPayload {
  name: string
  login: string
  password: string
  email: string
}

export interface LoginPayload {
  login: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
}
