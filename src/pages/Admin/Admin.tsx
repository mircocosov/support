import { useState, useEffect } from 'react'
import CategoriesSection from '@/pages/CategoriesSection'
import TicketHistorySection from '@/pages/TicketHistory'
import UsersSection from '@/pages/UsersSection'
import { useAuth } from '@/api/hooks'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import style from './Admin.module.scss'

const TABS = [
  { label: 'Категории' },
  { label: 'История' },
  { label: 'Пользователи' },
]

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { user, isAuthenticated, initialCheckDone } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (initialCheckDone) {
      if (!isAuthenticated) {
        navigate('/login')
      } else if (user?.role !== 'admin') {
        navigate('/')
      }
    }
  }, [isAuthenticated, user, initialCheckDone, navigate])

  if (!initialCheckDone) {
    return (
      <div className={style.centered}>
        <div className={style.loading}>Загрузка...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={style.centered}>
        <div className={style.loading}>Перенаправление на страницу входа...</div>
      </div>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <div className={style.centered}>
        <div className={style.loading}>Перенаправление...</div>
      </div>
    )
  }

  return (
    <div className={style.adminPage}>
      {/* Десктопные табы */}
      <div className={style.tabs}>
        {TABS.map((tab, idx) => (
          <Button
            key={tab.label}
            type="text"
            className={`${style.tab} ${idx === activeTab ? style.active : ''}`}
            onClick={() => setActiveTab(idx)}
            aria-current={idx === activeTab ? "page" : undefined}
          >
            {tab.label}
          </Button>
        ))}
        <Button type="text" className={style.tab} onClick={() => navigate('/tickets')}>
          Все тикеты
        </Button>
        <Button type='text' className={style.tab} onClick={() => navigate('/logout')}>
          Выйти
        </Button>
      </div>
      {/* Мобильные табы */}
      <div className={style.tabsColumn}>
        {TABS.map((tab, idx) => (
          <Button
            key={tab.label}
            type="text"
            className={`${style.tabSmall} ${idx === activeTab ? style.active : ''}`}
            onClick={() => setActiveTab(idx)}
            aria-current={idx === activeTab ? "page" : undefined}
          >
            {tab.label}
          </Button>
        ))}
        <Button type="text" className={style.tabSmall} onClick={() => navigate('/tickets')}>
          Все тикеты
        </Button>
        <Button type='text' className={style.tabSmall} onClick={() => navigate('/logout')}>
          Выйти
        </Button>
      </div>
      <div className={style.tabContent}>
        {activeTab === 0 && <CategoriesSection />}
        {activeTab === 1 && <TicketHistorySection />}
        {activeTab === 2 && <UsersSection />}
      </div>
    </div>
  )
}

export default AdminPage
