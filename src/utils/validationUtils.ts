import { FORM_VALIDATION } from '@/config/constants'

// Валидация email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Валидация пароля
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < FORM_VALIDATION.MIN_PASSWORD_LENGTH) {
    errors.push(`Пароль должен содержать минимум ${FORM_VALIDATION.MIN_PASSWORD_LENGTH} символов`)
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну заглавную букву')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну строчную букву')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Пароль должен содержать хотя бы одну цифру')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Валидация темы тикета
export const validateSubject = (subject: string): { isValid: boolean; error?: string } => {
  if (!subject.trim()) {
    return { isValid: false, error: 'Тема обязательна' }
  }
  
  if (subject.length > FORM_VALIDATION.MAX_SUBJECT_LENGTH) {
    return { 
      isValid: false, 
      error: `Тема не должна превышать ${FORM_VALIDATION.MAX_SUBJECT_LENGTH} символов` 
    }
  }
  
  return { isValid: true }
}

// Валидация описания тикета
export const validateDescription = (description: string): { isValid: boolean; error?: string } => {
  if (!description.trim()) {
    return { isValid: false, error: 'Описание обязательно' }
  }
  
  if (description.length > FORM_VALIDATION.MAX_DESCRIPTION_LENGTH) {
    return { 
      isValid: false, 
      error: `Описание не должно превышать ${FORM_VALIDATION.MAX_DESCRIPTION_LENGTH} символов` 
    }
  }
  
  return { isValid: true }
}

// Валидация комментария
export const validateComment = (comment: string): { isValid: boolean; error?: string } => {
  if (!comment.trim()) {
    return { isValid: false, error: 'Комментарий не может быть пустым' }
  }
  
  return { isValid: true }
}

// Валидация имени пользователя
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username.trim()) {
    return { isValid: false, error: 'Имя пользователя обязательно' }
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Имя пользователя должно содержать минимум 3 символа' }
  }
  
  if (username.length > 50) {
    return { isValid: false, error: 'Имя пользователя не должно превышать 50 символов' }
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Имя пользователя может содержать только буквы, цифры и знак подчеркивания' }
  }
  
  return { isValid: true }
}

// Валидация категории
export const validateCategory = (categoryId: number | null): { isValid: boolean; error?: string } => {
  if (!categoryId) {
    return { isValid: false, error: 'Выберите категорию' }
  }
  
  return { isValid: true }
} 