export const AUTH_KEYS = {
  all: ['auth'] as const,
  login: () => [...AUTH_KEYS.all, 'login'] as const,
  register: () => [...AUTH_KEYS.all, 'register'] as const,
  logout: () => [...AUTH_KEYS.all, 'logout'] as const,
}
