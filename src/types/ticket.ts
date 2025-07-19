import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig'

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface TicketAttachment {
  id: number
  file: string
  uploaded_at: string
}

export interface Ticket {
  id: number
  subject: string
  description: string
  category: number
  status: TicketStatus
  attachments: TicketAttachment[]
  created_at: string
  updated_at?: string
}

export interface CreateTicketDto {
  subject: string
  description: string
  category: number
  comment?: string
  attachments?: File[]
}

export interface TicketCategory {
  id: number
  name: string
  slug?: string
  description?: string
}

export const createTicketAPI = async (
  formData: FormData,
  token: string,
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.tickets.create}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Ошибка создания обращения: ${response.status} ${errorText}`,
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Ошибка при создании обращения:', error)
    throw error
  }
}
