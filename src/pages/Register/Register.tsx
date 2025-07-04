import { useState, FormEvent, ChangeEvent } from 'react'
import style from './Register.module.scss'
import Input from '@/components/ui/Input'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import { useAuth } from '@/api/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface RegisterCredentials {
  email: string
  username: string
  password: string
  re_password: string
}

interface ApiError {
  message: string
  status?: number
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    username: '',
    password: '',
    re_password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { register } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await register(formData)
      navigate('/login')
    } catch (err) {
      const error = err as ApiError
      setError(error.message || 'Ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
                value={formData.username}
                onChange={handleChange}
                required
                className={style.input}
              />
            </div>

            <div className={style.input_container}>
              <p className={style.label}>Почта</p>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={style.input}
              />
            </div>

            <div className={style.input_container}>
              <p className={style.label}>Пароль</p>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={style.input}
              />
            </div>

            <div className={style.input_container}>
              <p className={style.label}>Повторите пароль</p>
              <Input
                type="password"
                name="re_password"
                value={formData.re_password}
                onChange={handleChange}
                required
                className={style.input}
              />
            </div>
          </div>

          {error && <p className={style.error}>{error}</p>}

          <div className={style.buttons}>
            <Button
              type="primary"
              isDisabled={isLoading}
              onClick={handleSubmit}
              className={style.login_button}
            >
              {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
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
