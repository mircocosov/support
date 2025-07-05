// src/pages/Register/Register.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { RegisterCredentials } from '@/types/auth'
import Input from '@/components/ui/Input'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import style from './Register.module.scss'

export default function Register() {
  const { register } = useAuth()
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    re_password: '',
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
      await register(credentials)
      navigate('/login', { state: { registrationSuccess: true } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={style.main}>
      <div className={style.container}>
        <div className={style.logo}>
          <Icon icon="logo" className={style.icon} />
          <h1 className={style.title}>Регистрация</h1>
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
              <p className={style.label}>Email</p>
              <Input
                type="email"
                name="email"
                value={credentials.email}
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

            <div className={style.input_container}>
              <p className={style.label}>Подтверждение пароля</p>
              <Input
                type="password"
                name="re_password"
                value={credentials.re_password}
                onChange={handleChange}
                className={style.input}
                required
              />
            </div>
          </div>

          {error && <div className={style.error}>{error}</div>}

          <div className={style.buttons}>
            <Button type="primary" className={style.register_button}>
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <div className={style.links}>
              <Button type="text" link="/login">
                Уже есть аккаунт? Войти
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
