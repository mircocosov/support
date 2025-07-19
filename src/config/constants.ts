// Константы для статусов тикетов
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
} as const

export const TICKET_STATUS_LABELS: Record<string, string> = {
  [TICKET_STATUS.OPEN]: 'Открыт',
  [TICKET_STATUS.IN_PROGRESS]: 'В работе',
  [TICKET_STATUS.RESOLVED]: 'Решён',
  [TICKET_STATUS.CLOSED]: 'Закрыт',
}

// Константы для ролей пользователей
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPPORT: 'support',
  USER: 'user',
} as const

// Константы для файлов
export const FILE_CONFIG = {
  MAX_FILES: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  VALID_EXTENSIONS: [
    'jpg', 'jpeg', 'png', 'webp',
    'txt', 'log', 'docx', 'pdf', 'xlsx'
  ],
} as const

// Константы для уведомлений
export const NOTIFICATION_CONFIG = {
  REFRESH_DELAY: 500, // ms
  POLLING_INTERVAL: 30000, // 30 seconds
} as const

// Константы для пагинации
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// Константы для форм
export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_SUBJECT_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
} as const

// Константы для UI
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const 