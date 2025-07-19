import { useState, useEffect, useCallback } from 'react'
import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig'
import { useAuth } from './useAuth'
import { useNavigate } from 'react-router-dom'
import { Ticket, CreateTicketDto } from '@/types/ticket'

export const useTickets = () => {
  const { accessToken, logout, user } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState({
    tickets: false,
    action: false,
  })
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    if (!accessToken) {
      setError('Требуется авторизация')
      return
    }

    try {
      setLoading((prev) => ({ ...prev, tickets: true }))
      setError(null)

      // Выбираем правильный эндпоинт в зависимости от роли пользователя
      const endpoint = user?.role === 'admin' || user?.role === 'support' 
        ? API_ENDPOINTS.support.tickets 
        : API_ENDPOINTS.tickets.list

      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          // Автоматический разлогин и редирект на страницу входа
          if (logout) await logout()
          navigate('/login')
          return
        }
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message ||
            errorData?.detail ||
            `Ошибка загрузки обращений: ${response.status}`,
        )
      }

      const data = await response.json()
      setTickets(Array.isArray(data) ? data : data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading((prev) => ({ ...prev, tickets: false }))
    }
  }, [accessToken, logout, navigate, user?.role])

  const createTicket = async (ticketData: CreateTicketDto) => {
    if (!accessToken) throw new Error('Требуется авторизация')

    try {
      setLoading((prev) => ({ ...prev, action: true }))

      const formData = new FormData()
      formData.append('subject', ticketData.subject)
      formData.append('description', ticketData.description)
      formData.append('category', ticketData.category.toString())

      if (ticketData.attachments) {
        ticketData.attachments.forEach((file) => {
          formData.append('attachments', file)
        })
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.tickets.create}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message ||
            errorData?.detail ||
            'Ошибка создания обращения',
        )
      }

      const newTicket = await response.json()
      setTickets((prev) => [newTicket, ...prev])
      return newTicket
    } catch (err) {
      throw err instanceof Error ? err : new Error('Неизвестная ошибка')
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const updateTicket = async (id: number, ticketData: Partial<Ticket>) => {
    if (!accessToken) throw new Error('Требуется авторизация')

    try {
      setLoading((prev) => ({ ...prev, action: true }))

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.tickets.detail(id)}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketData),
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message ||
            errorData?.detail ||
            'Ошибка обновления обращения',
        )
      }

      const updatedTicket = await response.json()
      setTickets((prev) => prev.map((t) => (t.id === id ? updatedTicket : t)))
      return updatedTicket
    } catch (err) {
      throw err instanceof Error ? err : new Error('Неизвестная ошибка')
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket,
    updateTicket,
  }
}
