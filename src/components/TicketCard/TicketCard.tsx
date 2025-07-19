import React from 'react'
import style from './TicketCard.module.scss'
import { Ticket } from '@/types/ticket'
import Icon from '@/components/ui/Icon'

const STATUS_LABELS: Record<string, string> = {
  open: 'Открыт',
  in_progress: 'В работе',
  resolved: 'Решён',
  closed: 'Закрыт',
}

interface TicketCardProps {
  ticket: Ticket
  onClick?: () => void
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <div className={style.ticketCard} onClick={onClick} tabIndex={0} role="button"
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
    >
      <div className={style.header}>
        <h3 className={style.title}>#{ticket.id.toString().padStart(3, '0')} - {ticket.subject}</h3>
        <span className={`${style.status} ${style[ticket.status]}`}>{STATUS_LABELS[ticket.status]}</span>
      </div>
      <p className={style.description}>{ticket.description}</p>
      <div className={style.meta}>
        <span className={style.author}>{(ticket as any).author_username || '—'}</span>
        <span className={style.date}>
          {ticket.created_at ? new Date(ticket.created_at).toLocaleString('ru-RU') : '—'}
        </span>
      </div>
      {ticket.attachments && ticket.attachments.length > 0 && (
        <div className={style.attachments}>
          <Icon icon="paperclip" className={style.attachmentIcon} />
          {ticket.attachments.length} файл(ов)
        </div>
      )}
    </div>
  )
}

export default TicketCard 