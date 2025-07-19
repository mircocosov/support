import { useState, useEffect } from 'react'

// Хук для работы с localStorage
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Получить значение из localStorage или использовать начальное значение
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Функция для установки значения
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Позволить value быть функцией, чтобы у нас была та же логика, что и useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      // Сохранить в localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

// Хук для работы с sessionStorage
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Получить значение из sessionStorage или использовать начальное значение
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Функция для установки значения
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Позволить value быть функцией, чтобы у нас была та же логика, что и useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      // Сохранить в sessionStorage
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

// Утилиты для работы с токенами
export const tokenStorage = {
  // Получить access token
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken')
  },

  // Установить access token
  setAccessToken: (token: string): void => {
    localStorage.setItem('accessToken', token)
  },

  // Получить refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken')
  },

  // Установить refresh token
  setRefreshToken: (token: string): void => {
    localStorage.setItem('refreshToken', token)
  },

  // Очистить все токены
  clearTokens: (): void => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  // Получить пользователя
  getUser: (): any => {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  // Установить пользователя
  setUser: (user: any): void => {
    localStorage.setItem('user', JSON.stringify(user))
  },

  // Очистить пользователя
  clearUser: (): void => {
    localStorage.removeItem('user')
  },

  // Очистить все данные авторизации
  clearAuth: (): void => {
    tokenStorage.clearTokens()
    tokenStorage.clearUser()
  },
} 