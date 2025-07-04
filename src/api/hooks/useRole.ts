import { useAuth } from './useAuth'

export const useRole = () => {
  const { user, hasRole } = useAuth()

  return {
    isAdmin: hasRole('admin'),
    isSupport: hasRole('support'),
    isUser: !user?.role || hasRole('user'),
    currentRole: user?.role,
    hasRole,
  }
}
