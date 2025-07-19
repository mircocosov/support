import { USER_ROLES } from './constants'

// Конфигурация роутов
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  LOGOUT: '/logout',
  ADMIN: '/admin',
  SUPPORT: '/support',
  TICKETS: '/tickets',
  CREATE_TICKET: '/ticket/new',
  TICKET_DETAIL: (id: string | number) => `/ticket/${id}`,
} as const

// Конфигурация для защищенных роутов
export const PROTECTED_ROUTES = {
  [ROUTES.ADMIN]: [USER_ROLES.ADMIN],
  [ROUTES.SUPPORT]: [USER_ROLES.SUPPORT, USER_ROLES.ADMIN],
  [ROUTES.TICKETS]: [USER_ROLES.SUPPORT, USER_ROLES.ADMIN],
  [ROUTES.CREATE_TICKET]: [USER_ROLES.USER, USER_ROLES.SUPPORT, USER_ROLES.ADMIN],
} as const

// Конфигурация для редиректов по ролям
export const ROLE_REDIRECTS = {
  [USER_ROLES.ADMIN]: ROUTES.ADMIN,
  [USER_ROLES.SUPPORT]: ROUTES.SUPPORT,
  [USER_ROLES.USER]: ROUTES.HOME,
} as const 