import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import Dialog from '@/components/Dialog'
import style from './Logout.module.scss'

const LogoutPage = () => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = async () => {
    try {
      localStorage.clear()
      setOpen(false)
      navigate('/login', { replace: true })
    } catch (e) {
      setError('Ошибка при выходе. Попробуйте ещё раз.')
    }
  }

  return (
    <div className={style.container}>
      <div className={style.profileBox}>
        <div className={style.profileIcon}>
          <Icon icon="profile" className={style.profileIcon} />
        </div>
        <div className={style.profileInfo}>
          <div className={style.profileName}>{user?.username || 'Пользователь'}</div>
          <div className={style.profileEmail}>{user?.email || ''}</div>
        </div>
        <button onClick={() => setOpen(true)} className={style.logoutTextButton}>
          Выйти
        </button>
        <Button type="text" onClick={() => navigate(-1)} className={style.backButton}>
          Вернуться
        </Button>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className={style.dialogContent}>
          <h3>Подтвердите выход</h3>
          <p>Вы уверены, что хотите выйти из аккаунта?</p>
          <div className={style.dialogActions}>
            <Button type="text" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="text" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </Dialog>
      {error && (
        <div className={style.errorBox}>
          <p>{error}</p>
          <Button type="text" onClick={() => navigate('/admin')}>
            Вернуться в админку
          </Button>
        </div>
      )}
    </div>
  )
}

export default LogoutPage 