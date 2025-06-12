import { useMutation } from '@tanstack/react-query'
import { loginUser } from '../../../api/auth/login'
import { useAuthStore } from '../store/authStore'

export const useLogin = () => {
  const setAuthData = useAuthStore((state) => state.setAuthData)

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuthData(data.user, data.accessToken)
    },
  })
}
