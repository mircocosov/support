import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { useTickets } from '@/api/hooks/useTickets'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import style from './Home.module.scss'

const Home = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    initialCheckDone,
  } = useAuth()
  const { tickets, loading, error, fetchTickets } = useTickets()
  const navigate = useNavigate()

  useEffect(() => {
    if (!initialCheckDone || authLoading) return

    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    } else if (user?.role === 'admin') {
      navigate('/admin', { replace: true })
    } else if (user?.role === 'support') {
      navigate('/support', { replace: true })
    }
  }, [user, isAuthenticated, authLoading, initialCheckDone, navigate])

  const handleRetry = () => {
    fetchTickets()
  }

  if (!initialCheckDone || authLoading) {
    return <div className={style.loading}>Загрузка...</div>
  }

  if (!isAuthenticated) {
    return <div className={style.error}>Необходима авторизация</div>
  }

  return (
    <div className={style.container}>
      <header className={style.header}>
        <div className={style.logo}>
          <Icon icon="logo" />
          <h2>Поддержка</h2>
        </div>
        <Button type="primary" onClick={() => navigate('/ticket/new')}>
          Создать обращение
        </Button>
        <div className={style.actions}>
          <button className={style.actionButton}>
            <Icon icon="bell" />
          </button>
          <button className={style.actionButton}>
            <Icon icon="profile" />
          </button>
        </div>
      </header>

      <main className={style.mainContent}>
        <div className={style.ticketHeader}>
          <h1>Мои обращения</h1>
          <p className={style.ticketCount}>
            Найдено {tickets.length} обращения
          </p>
        </div>

        {error && (
          <div className={style.errorAlert}>
            <span>{error}</span>
            <button
              className={style.retryButton}
              onClick={handleRetry}
              disabled={loading.tickets}
            >
              Повторить
            </button>
          </div>
        )}

        <div className={style.filters}>
          <div className={style.searchBox}>
            <input
              type="text"
              placeholder="Поиск по названию или описанию"
              disabled={loading.tickets}
            />
          </div>
          <div className={style.statusFilter}>
            <label>
              <input
                type="checkbox"
                defaultChecked
                disabled={loading.tickets}
              />
              <span>Все статусы</span>
            </label>
          </div>
        </div>

        {loading.tickets ? (
          <div className={style.loading}>Загрузка обращений...</div>
        ) : (
          <div className={style.ticketList}>
            {tickets.map((ticket) => (
              <div key={ticket.id} className={style.ticketCard}>
                <div className={style.ticketId}>
                  #T-{ticket.id.toString().padStart(3, '0')}
                </div>
                <h3 className={style.ticketTitle}>{ticket.subject}</h3>
                <p className={style.ticketDescription}>{ticket.description}</p>

                <div className={style.ticketTags}>
                  {ticket.status === 'open' && (
                    <span className={style.tag}>Системная ошибка</span>
                  )}
                  {ticket.attachments.length > 0 && (
                    <span className={style.tag}>Прикрепленные файлы</span>
                  )}
                </div>

                <div className={style.ticketFooter}>
                  <div className={style.statusSection}>
                    <span className={style.statusLink}>В работе</span>
                    <span className={style.date}>
                      {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className={style.statusSection}>
                    <span className={style.statusLink}>Оператор</span>
                    <span className={style.date}>
                      {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className={style.statusSection}>
                    <span className={style.statusLink}>Решено</span>
                    <span className={style.date}>
                      {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
