import { useEffect, RefObject } from 'react'

// Хук для обработки кликов вне элемента
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current
      if (!el || el.contains((event?.target as Node) || null)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// Хук для обработки нажатий клавиш
export function useKeyPress(
  targetKey: string,
  handler: (event: KeyboardEvent) => void
): void {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        handler(event)
      }
    }

    document.addEventListener('keydown', listener)

    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [targetKey, handler])
}

// Хук для обработки Escape
export function useEscapeKey(handler: () => void): void {
  useKeyPress('Escape', handler)
}

// Хук для обработки Enter
export function useEnterKey(handler: () => void): void {
  useKeyPress('Enter', handler)
} 