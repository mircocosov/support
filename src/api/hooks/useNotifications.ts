import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '@/api/config/apiConfig'
import { Notification } from '@/types'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchNotifications = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.status === 401) {
        localStorage.removeItem('accessToken')
        navigate('/login')
        return
      }
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки уведомлений')
      }
      
      const data = await response.json()
      setNotifications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/notifications/${id}/mark-as-read/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_read: true }),
      })
      
      if (response.status === 401) {
        localStorage.removeItem('accessToken')
        navigate('/login')
        return
      }
      
      if (!response.ok) {
        throw new Error('Ошибка обновления уведомления')
      }
      
      // Обновляем локальное состояние
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Ошибка при пометке уведомления как прочитанного:', err)
    }
  }

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read)
    
    try {
      await Promise.all(
        unreadNotifications.map(notification => markAsRead(notification.id))
      )
    } catch (err) {
      console.error('Ошибка при пометке всех уведомлений как прочитанных:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Обновляем уведомления когда пользователь возвращается на вкладку
    const handleFocus = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          await fetchNotifications()
        } catch (error) {
          console.error('Ошибка обновления уведомлений при фокусе:', error)
        }
      }
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  }
} 