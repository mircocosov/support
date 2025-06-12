import { client } from '../api'

export const logoutUser = async (): Promise<void> => {
  await client.post('/auth/logout')
}
