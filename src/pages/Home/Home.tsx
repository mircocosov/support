import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { useTickets } from '@/api/hooks/useTickets'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Notifications from '@/components/Notifications/Notifications'
import TicketCard from '@/components/TicketCard/TicketCard'
import style from './Home.module.scss'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'open', label: 'Открыт' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'resolved', label: 'Решён' },
  { value: 'closed', label: 'Закрыт' },
]

const Home = () => {
  const { user, isAuthenticated, initialCheckDone } = useAuth()
  const { tickets, loading, error } = useTickets()
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
  const navigate = useNavigate()

  // Автоматическое перенаправление на основе роли
  useEffect(() => {
    if (initialCheckDone && isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin')
        return
      } else if (user.role === 'support') {
        navigate('/support')
        return
      }
      // Для роли 'user' остаемся на текущей странице
    }
  }, [initialCheckDone, isAuthenticated, user, navigate])



  if (!initialCheckDone) {
    return <div className={style.loading}>Загрузка...</div>
  }
  
  if (!isAuthenticated) {
    navigate('/login')
    return <div className={style.loading}>Перенаправление на страницу входа...</div>
  }

  const filteredTickets = statusFilter === 'all'
    ? tickets
    : tickets.filter(t => t.status === statusFilter)

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.left}>
          <h1 className={style.pageTitle}>Мои тикеты</h1>
        </div>
        <div className={style.center}>
          <Button type="primary" onClick={() => navigate('/ticket/new')}>
            Создать тикет
          </Button>
        </div>
        <div className={style.right}>
          <Notifications onNavigateToTicket={(ticketId) => navigate(`/ticket/${ticketId}`)} />
          <Button type="text" onClick={() => navigate('/logout')} className={style.logoutBtn}>
            Выйти
          </Button>
        </div>
      </header>
      <div className={style.filters}>
        <Select
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as any)}
          options={STATUS_OPTIONS}
          className={style.statusSelect}
        />
      </div>
      {loading.tickets ? (
        <div className={style.loading}>Загрузка тикетов...</div>
      ) : error ? (
        <div className={style.errorAlert}>{error}</div>
      ) : filteredTickets.length === 0 ? (
        <div className={style.empty}>Нет тикетов</div>
      ) : (
        <div className={style.ticketList}>
          {filteredTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => navigate(`/ticket/${ticket.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
