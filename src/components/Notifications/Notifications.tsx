import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { useNotifications } from '@/api/hooks/useNotifications'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import style from './Notifications.module.scss'

interface NotificationsProps {
  onNavigateToTicket?: (ticketId: number) => void
}

const Notifications: React.FC<NotificationsProps> = ({ onNavigateToTicket }) => {
  const { user, isAuthenticated } = useAuth()
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const handleNotificationClick = (notification: any) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    
    // Пытаемся извлечь ID тикета из сообщения
    const ticketIdMatch = notification.message.match(/тикет[а]?\s*#?(\d+)/i)
    if (ticketIdMatch && onNavigateToTicket) {
      const ticketId = parseInt(ticketIdMatch[1])
      onNavigateToTicket(ticketId)
      setIsOpen(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes} мин назад`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ч назад`
    } else {
      return date.toLocaleDateString('ru-RU')
    }
  }

  // Фильтруем уведомления, чтобы показывать только те, что связаны с тикетами
  const ticketNotifications = notifications.filter(notification => 
    notification.message.includes('тикет') || 
    notification.message.includes('ответ') ||
    notification.message.includes('комментарий')
  )

  // Обработчик клика за пределами компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className={style.notificationsContainer} ref={containerRef}>
      <button
        className={style.notificationsButton}
        onClick={async () => {
          if (!isAuthenticated) {
            navigate('/login')
            return
          }
          if (!isOpen) {
            // Обновляем уведомления при открытии панели
            setIsRefreshing(true)
            try {
              await fetchNotifications()
            } catch (error) {
              console.error('Ошибка загрузки уведомлений:', error)
            } finally {
              setIsRefreshing(false)
            }
          }
          setIsOpen(!isOpen)
        }}
        aria-label="Уведомления"
      >
        <Icon icon="bell" className={style.bellIcon} />
        {unreadCount > 0 && (
          <span className={style.badge}>{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className={style.dropdown}>
          <div className={style.header}>
            <h3 className={style.title}>Уведомления</h3>
            <div className={style.headerActions}>
              <Button
                type="text"
                onClick={async () => {
                  setIsRefreshing(true)
                  try {
                    await fetchNotifications()
                  } catch (error) {
                    console.error('Ошибка обновления уведомлений:', error)
                  } finally {
                    // Добавляем небольшую задержку, чтобы анимация всегда была видна
                    setTimeout(() => {
                      setIsRefreshing(false)
                    }, 500)
                  }
                }}
                className={style.refreshBtn}
                isDisabled={loading || isRefreshing}
              >
                <Icon icon="refresh" className={`${style.refreshIcon} ${(loading || isRefreshing) ? style.spinning : ''}`} />
              </Button>
              {unreadCount > 0 && (
                <Button
                  type="text"
                  onClick={markAllAsRead}
                  className={style.markAllRead}
                >
                  Прочитать все
                </Button>
              )}
            </div>
          </div>

          <div className={style.notificationsList}>
            {loading ? (
              <div className={style.loading}>Загрузка...</div>
            ) : ticketNotifications.length === 0 ? (
              <div className={style.empty}>Нет уведомлений</div>
            ) : (
              ticketNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${style.notificationItem} ${
                    !notification.is_read ? style.unread : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={style.notificationContent}>
                    <p className={style.message}>{notification.message}</p>
                    <span className={style.time}>
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  {!notification.is_read && (
                    <div className={style.unreadDot} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications 