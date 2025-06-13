interface AuthResponse {
  access: string
  refresh: string
  user?: {
    id: string
    email: string
  }
}

interface LoginCredentials {
  email: string
  password: string
}

interface RefreshToken {
  refresh: string
}

export type { AuthResponse, LoginCredentials, RefreshToken }
