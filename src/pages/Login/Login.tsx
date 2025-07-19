import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { LoginCredentials } from '@/types/auth'
import Input from '@/components/ui/Input'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import style from './Login.module.scss'

export default function Login() {
  const { login, isAuthenticated, user, initialCheckDone } = useAuth()
  const userRole = user?.role
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!initialCheckDone) return
    if (isAuthenticated && userRole) {
      switch (userRole) {
        case 'admin':
          navigate('/admin', { replace: true })
          break
        case 'support':
          navigate('/support', { replace: true })
          break
        default:
          navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, userRole, initialCheckDone, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      await login(credentials)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Неверный логин или пароль')
      setIsSubmitting(false)
    }
  }

  if (!initialCheckDone) return null

  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <h1 className={style.title}>Авторизация</h1>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formGroup}>
            <label className={style.formLabel}>
              Логин
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className={style.formInput}
              required
            />
          </div>

          <div className={style.formGroup}>
            <label className={style.formLabel}>
              Пароль
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className={style.formInput}
              required
            />
          </div>

          {error && <div className={style.error}>{error}</div>}

          <button
            type="submit"
            className={style.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Вход...' : 'Войти'}
          </button>

          <div className={style.links}>
            <a href="/register" className={style.link}>
              Регистрация
            </a>
            <a href="/forgot-password" className={style.link}>
              Забыли пароль?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
