import { client } from '../api'
import { LoginPayload, AuthResponse } from '@/type/auth'

export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/auth/login', payload)
  return response.data
}
