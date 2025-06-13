interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'closed'
  createdAt: string
  updatedAt: string
}

interface Comment {
  id: string
  text: string
  authorId: string
  createdAt: string
}

interface TicketCreateData {
  title: string
  description: string
}

export type { Ticket, Comment, TicketCreateData }
