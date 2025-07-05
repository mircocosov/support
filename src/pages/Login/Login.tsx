import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { LoginCredentials } from '@/types/auth'
import Input from '@/components/ui/Input'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import style from './Login.module.scss'

export default function Login() {
  const { login, isAuthenticated, userRole } = useAuth()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Обработка редиректа после успешной аутентификации
  useEffect(() => {
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
  }, [isAuthenticated, userRole, navigate])

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
      // Навигация теперь обрабатывается в useEffect
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Неверный логин или пароль')
      setIsSubmitting(false)
    }
  }

  return (
    <main className={style.main}>
      <div className={style.container}>
        <div className={style.logo}>
          <Icon icon="logo" className={style.icon} />
          <h1 className={style.title}>Авторизация</h1>
        </div>

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.inputs}>
            <div className={style.input_container}>
              <p className={style.label}>Логин</p>
              <Input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className={style.input}
                required
              />
            </div>

            <div className={style.input_container}>
              <p className={style.label}>Пароль</p>
              <Input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className={style.input}
                required
              />
            </div>
          </div>

          {error && <div className={style.error}>{error}</div>}

          <div className={style.buttons}>
            <Button
              type="primary"
              className={style.login_button}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
            </Button>

            <div className={style.links}>
              <Button type="text" link="/register">
                Регистрация
              </Button>
              <span className={style.divider}>|</span>
              <Button type="text" link="/forgot-password">
                Забыли пароль?
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
