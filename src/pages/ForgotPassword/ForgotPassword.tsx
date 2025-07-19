import { useState } from 'react'
import style from './ForgotPassword.module.scss'
import Input from '@/components/ui/Input'
import Icon from '@/components/ui/Icon'
import Button from '@/components/ui/Button'
import { useApi } from '@/api/hooks/useApi'
import { API_ENDPOINTS } from '@/api/config/apiConfig'

export default function ForgotPassword() {
  const { sendRequest, isLoading } = useApi()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      await sendRequest({
        url: API_ENDPOINTS.auth.forgotPassword,
        method: 'POST',
        data: { email },
      })

      setMessage('Инструкции по восстановлению пароля отправлены на ваш email')
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при отправке запроса')
      console.error('Password reset error:', err)
    }
  }

  return (
    <main className={style.main}>
      <div className={style.container}>
        <div className={style.logo}>
          <Icon icon="logo" className={style.icon} />
          <h1 className={style.title}>Восстановление пароля</h1>
        </div>

        <div className={style.content}>
          <p className={style.description}>
            Чтобы получить доступ к аккаунту, введите email-адрес, который вы
            указали при регистрации и мы отправим инструкции по его
            восстановлению.
          </p>

          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.input_container}>
              <h2 className={style.subtitle}>Email</h2>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={style.input}
                required
              />
            </div>

            {error && <div className={style.error}>{error}</div>}
            {message && <div className={style.success}>{message}</div>}

            <div className={style.buttons}>
              <Button type="primary" className={style.submit_button}>
                {isLoading ? 'Отправка...' : 'Отправить инструкции'}
              </Button>
            </div>
          </form>

          <div className={style.links}>
            <Button type="text" link="/login">
              У меня уже есть аккаунт
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
