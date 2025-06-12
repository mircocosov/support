import { client } from '../api'
import { RegisterPayload, AuthResponse } from '@/type/auth'

export const registerUser = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/auth/register', payload)
  return response.data
}
