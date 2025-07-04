import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { LoginCredentials } from '@/types/auth'
import Input from '@/components/ui/Input'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import style from './Login.module.scss'

export default function Login() {
  const { login } = useAuth()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

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
      const response = await login(credentials)

      localStorage.setItem('access_token', response.access)
      if (response.refresh) {
        localStorage.setItem('refresh_token', response.refresh)
      }

      const role = response.user?.role || 'user'
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true })
          break
        case 'support':
          navigate('/support/tickets', { replace: true })
          break
        default:
          navigate('/', { replace: true })
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Неверный логин или пароль')
    } finally {
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
            <Button type="primary" className={style.login_button}>
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
