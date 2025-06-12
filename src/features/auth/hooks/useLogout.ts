import { useMutation } from '@tanstack/react-query'
import { logoutUser } from '../../../api/auth/logout'
import { useAuthStore } from '../store/authStore'

export const useLogout = () => {
  const clearAuthData = useAuthStore((state) => state.clearAuthData)

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAuthData()
    },
  })
}
