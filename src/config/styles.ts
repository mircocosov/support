// Цветовая схема
export const COLORS = {
  // Основные цвета
  PRIMARY: '#1976d2',
  SECONDARY: '#dc004e',
  SUCCESS: '#2e7d32',
  WARNING: '#ed6c02',
  ERROR: '#d32f2f',
  INFO: '#0288d1',
  
  // Нейтральные цвета
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Статусы тикетов
  STATUS: {
    OPEN: '#1976d2',
    IN_PROGRESS: '#ed6c02',
    RESOLVED: '#2e7d32',
    CLOSED: '#757575',
  },
} as const

// Градиенты
export const GRADIENTS = {
  PRIMARY: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
  HOVER: 'linear-gradient(90deg, #ff6a00 0%, #ee0979 100%)',
  UNDERLINE: 'linear-gradient(90deg, #ff6a00 0%, #ee0979 100%)',
} as const

// Часто используемые цвета
export const COMMON_COLORS = {
  WHITE: '#ffffff',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
  OVERLAY: 'rgba(255,255,255,0.12)',
  TEXT_SHADOW: 'rgba(0,0,0,0.18)',
} as const

// Размеры и отступы
export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
  XXL: '48px',
} as const

// Размеры шрифтов
export const FONT_SIZES = {
  XS: '12px',
  SM: '14px',
  MD: '16px',
  LG: '18px',
  XL: '20px',
  XXL: '24px',
  XXXL: '32px',
} as const

// Веса шрифтов
export const FONT_WEIGHTS = {
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
} as const

// Радиусы скругления
export const BORDER_RADIUS = {
  SM: '4px',
  MD: '8px',
  LG: '12px',
  XL: '16px',
  ROUND: '50%',
} as const

// Тени
export const SHADOWS = {
  SM: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  MD: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  LG: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  XL: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
} as const

// Анимации
export const TRANSITIONS = {
  FAST: '150ms ease-in-out',
  NORMAL: '300ms ease-in-out',
  SLOW: '500ms ease-in-out',
  CUBIC: '0.35s cubic-bezier(.4,0,.2,1)',
} as const

// Z-индексы
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const 