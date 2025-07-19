import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { useNotifications } from '@/api/hooks/useNotifications'
import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig'
import { Ticket } from '@/types/ticket'
import { User } from '@/types/admin'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { 
  TICKET_STATUS_LABELS, 
  USER_ROLES,
} from '@/config/constants'
import { getFileIcon, downloadFile, formatDate } from '@/utils'
import style from './TicketPage.module.scss'
import classNames from 'classnames'

interface TicketComment {
  id: number
  author_username?: string
  author?: string
  text?: string
  message?: string
  is_internal?: boolean
  created_at: string
}

interface TicketCategory {
  id: number
  name: string
}



export default function TicketPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { fetchNotifications } = useNotifications()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [answer, setAnswer] = useState('')
  const [comments, setComments] = useState<TicketComment[]>([])
  const [supports, setSupports] = useState<User[]>([])
  const [assignee, setAssignee] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInternal, setIsInternal] = useState(false)
  const [categories, setCategories] = useState<TicketCategory[]>([])
  const navigate = useNavigate()

  // Отладочная информация
  console.log('TicketPage render:', { id, user: user?.role, loading, error: !!error, hasTicket: !!ticket })

  // Получить тикет
  useEffect(() => {
    async function fetchTicket() {
      // Проверяем авторизацию перед запросом
      if (!user) {
        console.log('No user, skipping ticket fetch')
        return
      }
      
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.log('No token, redirecting to login')
        navigate('/login')
        return
      }
      
      setLoading(true)
      setError('')
      try {
        // Выбираем правильный эндпоинт в зависимости от роли пользователя
        const endpoint = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPPORT 
          ? API_ENDPOINTS.support.ticketById(Number(id))
          : API_ENDPOINTS.tickets.detail(Number(id))
        
        console.log('Fetching ticket:', { id, userRole: user?.role, endpoint })
        
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          cache: 'no-store',
        })
        
        console.log('Ticket response:', { status: res.status, ok: res.ok })
        
        if (!res.ok) {
          const errorText = await res.text()
          console.error('Ticket error response:', errorText)
          
          if (res.status === 401) {
            // Неавторизованный доступ - перенаправляем на логин
            navigate('/login')
            throw new Error('Необходима авторизация')
          } else if (res.status === 403) {
            // Доступ запрещен - возможно, тикет не принадлежит пользователю
            throw new Error('Доступ к тикету запрещен')
          } else if (res.status === 404) {
            throw new Error('Тикет не найден')
          } else {
            throw new Error(`Ошибка загрузки тикета: ${res.status}`)
          }
        }
        
        const data = await res.json()
        console.log('Ticket data received:', data)
        setTicket(data)
        setStatus(data.status)
        setAssignee((data as any).assignee || '')
      } catch (e) {
        console.error('Ticket fetch error:', e)
        setError(e instanceof Error ? e.message : 'Ошибка загрузки тикета')
      } finally {
        setLoading(false)
      }
    }
    fetchTicket()
  }, [id, user?.role, user])

  // Получить комментарии
  useEffect(() => {
    async function fetchComments() {
      if (!id || !user) return
      
      const token = localStorage.getItem('accessToken')
      if (!token) return
      
      try {
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.tickets.comments(Number(id))}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login')
            throw new Error('Необходима авторизация')
          }
          throw new Error('Ошибка загрузки комментариев')
        }
        const data = await res.json()
        setComments(Array.isArray(data) ? data : data.results)
      } catch {
        setComments([])
      }
    }
    fetchComments()
  }, [id, user])

  // Получить категории
  useEffect(() => {
    async function fetchCategories() {
      if (!user) return
      
      const token = localStorage.getItem('accessToken')
      if (!token) return
      
      try {
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.tickets.categories}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login')
            throw new Error('Необходима авторизация')
          }
          throw new Error('Ошибка загрузки категорий')
        }
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : data.results)
      } catch {
        setCategories([])
      }
    }
    fetchCategories()
  }, [user])

  // Для админа — получить список support-юзеров
  useEffect(() => {
    async function fetchSupports() {
      if (!user || user.role !== USER_ROLES.ADMIN) {
        setSupports([])
        return
      }
      
      const token = localStorage.getItem('accessToken')
      if (!token) return
      
      try {
        const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.admin.users}?role=support`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          if (res.status === 401) {
            navigate('/login')
            throw new Error('Необходима авторизация')
          }
          throw new Error('Ошибка загрузки сотрудников')
        }
        const data = await res.json()
        setSupports(Array.isArray(data) ? data : data.results)
      } catch {
        setSupports([])
      }
    }
    fetchSupports()
  }, [user])

  // Смена статуса (support/admin)
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    if (!id) return
    
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.support.status(Number(id))}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const errText = await res.text();
        console.error('Ошибка смены статуса:', errText)
        throw new Error('Ошибка смены статуса')
      }
      const updated = await res.json()
      setTicket(updated)
      setStatus(updated.status)
      

    } catch (err) {
      // Можно добавить обработку ошибки
    }
  }

  // Назначение support (admin)
  const handleAssigneeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAssignee = e.target.value
    setAssignee(newAssignee)
    if (!id) return
    
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.support.assign(Number(id))}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assigned_to: newAssignee }),
      })
      if (!res.ok) {
        const errText = await res.text();
        console.error('Ошибка назначения сотрудника:', errText)
        throw new Error('Ошибка назначения сотрудника')
      }
      const updated = await res.json()
      setTicket(prev => prev ? { ...prev, assignee: updated.assigned_to } : prev)
      

    } catch (err) {
      // Можно добавить обработку ошибки
    }
  }

  // Оставить комментарий
  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/login')
      return
    }
    
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.tickets.comments(Number(id))}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: answer, 
          is_internal: user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPPORT ? isInternal : false 
        }),
      })
      if (!res.ok) {
        const errText = await res.text();
        console.error('Ошибка отправки комментария:', errText)
        throw new Error('Ошибка отправки комментария')
      }
      setAnswer('')
      setIsInternal(false)
      // Обновить комментарии
      const updated = await res.json()
      setComments(prev => [...prev, updated])
      
      // Обновить уведомления только если комментарий не внутренний
      if (!isInternal) {
        fetchNotifications()
      }

    } catch {
      // Можно добавить обработку ошибки
    } finally {
      setIsSubmitting(false)
    }
  }

  // Проверка авторизации
  if (!user) {
    navigate('/login');
    return <div className={style.loading}>Перенаправление на страницу входа...</div>;
  }

  if (loading) return <div className={style.loading}>Загрузка...</div>;
  if (error || !ticket) return <div className={style.error}>{error || 'Тикет не найден'}</div>;

  return (
    <div>
      <div className={style.ticketPage}>
        {/* 1. Заголовок и мета */}
        <div className={style.sectionTitle}>Тикет #{ticket.id}</div>
        <div className={style.ticketMetaGroup}>
          <div className={style.ticketMetaRow}>
            <span className={style.ticketMetaLabel}>Статус:</span>
            <span className={classNames(style.status, style[ticket.status])}>{TICKET_STATUS_LABELS[ticket.status]}</span>
          </div>
          <div className={style.ticketMetaRow}>
            <span className={style.ticketMetaLabel}>Создан:</span>
            <span>{ticket.created_at ? formatDate(ticket.created_at) : '—'}</span>
          </div>
        </div>
        <hr className={style.divider} />
        {/* 2. Основная информация */}
        <div className={style.sectionTitle}>Основная информация</div>
        <div className={style.ticketSubject}>{ticket.subject}</div>
        <div className={style.ticketDesc}>{ticket.description}</div>
        <hr className={style.divider} />
        {/* 3. Ответственный и категория */}
        <div className={style.sectionTitle}>Ответственный и категория</div>
        <div className={style.ticketMetaGroup}>
          <div className={style.ticketMetaRow}>
            <span className={style.ticketMetaLabel}>Ответственный:</span>
            <span>{(ticket as any).assignee_username || (assignee && supports.find(s => s.id === assignee)?.username) || 'Не назначен'}</span>
          </div>
          <div className={style.ticketMetaRow}>
            <span className={style.ticketMetaLabel}>Категория:</span>
            <span>{
              (ticket as any).category_name ||
              (categories.find(cat => cat.id === ticket.category)?.name) ||
              '—'
            }</span>
          </div>
        </div>
        <hr className={style.divider} />
        {/* 4. Вложения */}
        <div className={style.sectionTitle}>Вложения</div>
        {ticket.attachments && ticket.attachments.length > 0 ? (
          <div className={style.attachmentsBlock}>
            <div className={style.attachmentsList}>
              {ticket.attachments.map(att => {
                const filename = att.file.split('/').pop() || 'Файл'
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(att.file)
                
                return (
                  <div key={att.id} className={style.attachmentItem}>
                    {isImage ? (
                      <div className={style.attachmentImageContainer}>
                        <img 
                          src={att.file} 
                          alt={filename} 
                          className={style.attachmentImg}
                          onClick={() => window.open(att.file, '_blank')}
                        />
                        <div className={style.attachmentOverlay}>
                          <button 
                            className={style.downloadButton}
                            onClick={() => downloadFile(att.file, filename)}
                            title="Скачать файл"
                          >
                            📥
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={style.attachmentFile}
                        onClick={() => downloadFile(att.file, filename)}
                      >
                        <span className={style.fileIcon}>{getFileIcon(filename) || <Icon icon="paperclip" />}</span>
                        <span className={style.fileName}>{filename}</span>
                        <span className={style.downloadIcon}>📥</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className={style.ticketDesc}>Нет вложений</div>
        )}
        <hr className={style.divider} />
        {/* 5. Комментарии */}
        <div className={style.sectionTitle}>Комментарии</div>
        <div className={style.commentsSection}>
          {comments.length === 0 ? (
            <div className={style.commentItem}>
              <div className={style.commentMeta}>Пока нет комментариев</div>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className={style.commentItem}>
                <div className={style.commentMeta}>
                  <b>{comment.author_username ? comment.author_username : (comment.author ? comment.author : '—')}</b> — {formatDate(comment.created_at)}
                  {comment.is_internal && (
                    <span className={style.internalLabel}>Внутренний</span>
                  )}
                </div>
                <div className={style.commentText}>{comment.message || comment.text}</div>
              </div>
            ))
          )}
        </div>
        <hr className={style.divider} />
        {/* 6. Действия */}
        <div className={style.sectionTitle}>Действия</div>
        <div className={style.ticketActions}>
          {user && (
            <form onSubmit={handleComment} className={style.answerForm}>
              <textarea
                className={style.textarea}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Ваш комментарий..."
                required
              />
              {(user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPPORT) && (
                <label className={style.internalCheckbox}>
                  <input
                    type="checkbox"
                    checked={isInternal}
                    onChange={e => setIsInternal(e.target.checked)}
                  />
                  <span>Внутренний комментарий</span>
                </label>
              )}
              <Button type="primary" isDisabled={isSubmitting}>
                Оставить комментарий
              </Button>
              <div className={style.commentFormSpacer} />
            </form>
          )}
          {(user && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPPORT)) && (
            <div className={style.ticketMeta}>
              {user.role === USER_ROLES.ADMIN && (
                <>
                  <span>Ответственный: </span>
                  <select value={assignee} onChange={handleAssigneeChange} className={style.statusSelect}>
                    <option value="">Не назначен</option>
                    {supports.map(s => (
                      <option key={s.id} value={s.id}>{s.username}</option>
                    ))}
                  </select>
                </>
              )}
              <span>Статус: </span>
              <select value={status} onChange={handleStatusChange} className={style.statusSelect}>
                {Object.entries(TICKET_STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* Кнопка возврата */}
        <div className={style.backButtonContainer}>
          <Button type="primary" onClick={() => {
            if (user?.role === USER_ROLES.ADMIN) {
              navigate('/admin')
            } else if (user?.role === USER_ROLES.SUPPORT) {
              navigate('/support')
            } else {
              navigate('/')
            }
          }}>
            Вернуться
          </Button>
        </div>
      </div>
    </div>
  )
} 