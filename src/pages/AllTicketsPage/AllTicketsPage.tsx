import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig'
import style from './AllTicketsPage.module.scss'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Ticket } from '@/types/ticket'
import classNames from 'classnames'

const STATUS_LABELS: Record<string, string> = {
  all: 'Все',
  open: 'Открыт',
  in_progress: 'В работе',
  resolved: 'Решён',
  closed: 'Закрыт',
}

export default function AllTicketsPage() {
  const { user, initialCheckDone } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
  const navigate = useNavigate()

  useEffect(() => {
    if (!initialCheckDone) return
    if (!user || (user.role !== 'admin' && user.role !== 'support')) {
      navigate('/')
      return
    }
    fetchTickets()
    // eslint-disable-next-line
  }, [initialCheckDone, user])

  const fetchTickets = async () => {
    setLoading(true)
    setError('')
    try {
      // Используем правильный эндпоинт для админов и саппорта
      const endpoint = user?.role === 'admin' || user?.role === 'support' 
        ? API_ENDPOINTS.support.tickets 
        : API_ENDPOINTS.tickets.list
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Ошибка загрузки тикетов')
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : data.results)
    } catch (e) {
      setError('Ошибка загрузки тикетов')
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = statusFilter === 'all'
    ? tickets
    : tickets.filter(t => t.status === statusFilter)

  if (!initialCheckDone) return <div className={style.loading}>Загрузка...</div>
  if (!user || (user.role !== 'admin' && user.role !== 'support')) return null

  return (
    <div className={style.allTicketsPage}>
      {/* Десктопные табы */}
      <div className={style.tabs}>
        <Button type="text" className={style.tab} onClick={() => navigate('/admin')}>
          Категории
        </Button>
        <Button type="text" className={style.tab} onClick={() => navigate('/admin')}>
          История
        </Button>
        <Button type="text" className={style.tab} onClick={() => navigate('/admin')}>
          Пользователи
        </Button>
        <Button type="text" className={classNames(style.tab, style.tabActive)} aria-current="page">
          Все тикеты
        </Button>
        <Button type="text" className={style.tab} onClick={() => navigate('/logout')}>
          Выйти
        </Button>
      </div>
      {/* Мобильные табы */}
      <div className={style.tabsColumn}>
        <Button type="text" className={style.tabSmall} onClick={() => navigate('/admin')}>
          Категории
        </Button>
        <Button type="text" className={style.tabSmall} onClick={() => navigate('/admin')}>
          История
        </Button>
        <Button type="text" className={style.tabSmall} onClick={() => navigate('/admin')}>
          Пользователи
        </Button>
        <Button type="text" className={classNames(style.tabSmall, style.tabActive)} aria-current="page">
          Все тикеты
        </Button>
        <Button type="text" className={style.tabSmall} onClick={() => navigate('/logout')}>
          Выйти
        </Button>
      </div>
      <div className={style.allTicketsPageContent}>
        <div className={style.headerRow}>
          <h1 className={style.pageTitle}>Все тикеты</h1>
          <Select
            value={statusFilter}
            onChange={v => setStatusFilter(v as any)}
            options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </div>
        {loading ? (
          <div className={style.loading}>Загрузка тикетов...</div>
        ) : error ? (
          <div className={style.error}>{error}</div>
        ) : filteredTickets.length === 0 ? (
          <div className={style.empty}>Нет тикетов</div>
        ) : (
          <table className={style.ticketsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Тема</th>
                <th>Автор</th>
                <th>Статус</th>
                <th>Дата создания</th>
                <th>Ответственный</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className={style.ticketRow} onClick={() => navigate(`/ticket/${ticket.id}`)}>
                  <td>{ticket.id}</td>
                  <td>{ticket.subject}</td>
                  <td>{(ticket as any).author_username || '—'}</td>
                  <td>{STATUS_LABELS[ticket.status]}</td>
                  <td>{ticket.created_at ? new Date(ticket.created_at).toLocaleString('ru-RU') : '—'}</td>
                  <td>{(ticket as any).assignee_username || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
} 