import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../../../api/auth/register'
import { useAuthStore } from '../store/authStore'

export const useRegister = () => {
  const setAuthData = useAuthStore((state) => state.setAuthData)

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAuthData(data.user, data.accessToken)
    },
  })
}
