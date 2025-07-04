import { useCallback } from 'react'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '../config/apiConfig'
import type { Ticket, Comment, TicketCreateData } from '@/types/ticket'

export const useTickets = () => {
  const { sendRequest, loading, error } = useApi()

  const getTickets = useCallback(async (): Promise<Ticket[]> => {
    return sendRequest<Ticket[]>({
      url: API_ENDPOINTS.tickets.list,
      method: 'GET',
    })
  }, [sendRequest])

  const createTicket = useCallback(
    async (data: TicketCreateData): Promise<Ticket> => {
      return sendRequest<Ticket>({
        url: API_ENDPOINTS.tickets.create,
        method: 'POST',
        data,
      })
    },
    [sendRequest],
  )

  const getTicketComments = useCallback(
    async (ticketId: string): Promise<Comment[]> => {
      return sendRequest<Comment[]>({
        url: API_ENDPOINTS.tickets.comments(ticketId),
        method: 'GET',
      })
    },
    [sendRequest],
  )

  return {
    getTickets,
    createTicket,
    getTicketComments,
    loading,
    error,
  }
}
