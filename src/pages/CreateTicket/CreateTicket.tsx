import {
  useState,
  useRef,
  ChangeEvent,
  DragEvent,
  FormEvent,
  useEffect,
  useCallback,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'
import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig'
import { refreshToken } from '@/types/auth'
import { createTicketAPI, TicketCategory } from '@/types/ticket'
import Icon from '@/components/ui/Icon'
import style from './CreateTicket.module.scss'

interface FileAttachment {
  file: File
  id: string
}

const MAX_FILES = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024
const VALID_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'txt',
  'log',
  'docx',
  'pdf',
  'xlsx',
]

const CreateTicketPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, initialCheckDone } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<number | null>(null)
  const [description, setDescription] = useState('')
  const [comment, setComment] = useState('')
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Category states
  const [categories, setCategories] = useState<TicketCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')

  // Проверка авторизации
  useEffect(() => {
    if (initialCheckDone && !isAuthenticated) {
      navigate('/login')
      return
    }
  }, [initialCheckDone, isAuthenticated, navigate])

  // Fetch categories
  useEffect(() => {
    if (!isAuthenticated) return
    
    const fetchCategories = async () => {
      const url = `${API_BASE_URL}${API_ENDPOINTS.tickets.categories}`

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Ошибка ${response.status}: ${errorText}`)
        }

        const data: TicketCategory[] = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data)
        } else {
          setCategories([])
          setCategoriesError('Сервер вернул пустой список категорий')
        }
      } catch (error) {
        const err = error as Error
        setCategories([])
        setCategoriesError(err.message || 'Ошибка подключения к серверу')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [isAuthenticated])

  // Handle file validation and processing
  const processFiles = useCallback(
    (files: FileList) => {
      const newFiles: FileAttachment[] = []
      let newError = ''

      Array.from(files).forEach((file) => {
        if (attachments.length + newFiles.length >= MAX_FILES) {
          newError = `Максимальное количество файлов - ${MAX_FILES}`
          return
        }

        const extension = file.name.split('.').pop()?.toLowerCase() || ''

        if (!VALID_EXTENSIONS.includes(extension)) {
          newError = `Недопустимый формат файла: ${file.name}`
          return
        }

        if (file.size > MAX_FILE_SIZE) {
          newError = `Файл слишком большой: ${file.name} (макс. ${
            MAX_FILE_SIZE / 1024 / 1024
          } МБ)`
          return
        }

        newFiles.push({
          file,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        })
      })

      if (newError) {
        setError(newError)
      }

      if (newFiles.length > 0) {
        setAttachments((prev) => [...prev, ...newFiles])
      }
    },
    [attachments.length],
  )

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('')
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      e.target.value = ''
    }
  }

  // Handle file drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  // Remove file
  const removeFile = (id: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== id))
  }

  // Submit form with token refresh handling
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!subject.trim()) return setError('Укажите тему обращения')
    if (!category) return setError('Выберите категорию')
    if (!description.trim()) return setError('Опишите проблему')

    setIsSubmitting(true)

    try {
      let accessToken = localStorage.getItem('accessToken') || ''
      let retry = false

      do {
        try {
          // Create form data
          const formData = new FormData()
          formData.append('subject', subject)
          formData.append('category', category.toString())
          formData.append('description', description)

          if (comment.trim()) formData.append('comment', comment)

          attachments.forEach(({ file }) => {
            formData.append('attachments', file)
          })

          await createTicketAPI(formData, accessToken)
          navigate('/')
          return
        } catch (error) {
          const err = error as Error

          // Handle 401 Unauthorized only on first attempt
          if (
            !retry &&
            (err.message.includes('401') ||
              err.message.includes('Unauthorized'))
          ) {
            retry = true
            try {
              const newAccessToken = await refreshToken()
              if (newAccessToken) {
                accessToken = newAccessToken
                localStorage.setItem('accessToken', newAccessToken)
                continue
              }
            } catch {
              setError('Сессия истекла. Пожалуйста, войдите снова.')
              return
            }
          }

          // Handle specific 400 error
          if (err.message.includes('400') && err.message.includes('category')) {
            setError(
              'Выбранная категория не существует. Пожалуйста, обновите страницу и попробуйте снова.',
            )
          } else {
            setError(err.message || 'Неизвестная ошибка')
          }
          return
        }
      } while (retry)
    } catch (error) {
      const err = error as Error
      setError(err.message || 'Произошла непредвиденная ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!initialCheckDone) {
    return <div className={style.loading}>Загрузка...</div>
  }

  if (!isAuthenticated) {
    return <div className={style.loading}>Перенаправление на страницу входа...</div>
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.left}>
          <h1 className={style.pageTitle}>Создать обращение</h1>
        </div>
      </div>

      <div className={style.formContainer}>
        {categoriesError && (
          <div className={style.error}>
            <strong>Внимание:</strong> {categoriesError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formGroup}>
            <label className={style.formLabel}>
              Тема обращения*
            </label>
            <input
              className={style.formInput}
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Краткое описание проблемы..."
              required
            />
          </div>

          <div className={style.formGroup}>
            <label className={style.formLabel}>
              Описание проблемы*
            </label>
            <textarea
              className={style.formTextarea}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Подробно опишите проблему..."
              required
            />
          </div>

          <div className={style.formGroup}>
            <label className={style.formLabel}>
              Категория*
            </label>
            <select
              className={style.formSelect}
              value={category ?? ''}
              onChange={e => setCategory(Number(e.target.value))}
              required
            >
              <option value="" disabled>Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={style.formGroup}>
            <label className={style.formLabel}>
              Вложения
            </label>
            <div className={style.fileUpload}>
              <input
                type="file"
                multiple
                className={style.fileInput}
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.webp,.txt,.log,.docx,.pdf,.xlsx"
              />
              <div 
                className={style.fileLabel}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <Icon icon="paperclip" /> Нажмите или перетащите файлы для загрузки
              </div>
              <div className={style.fileList}>
                {attachments.map(att => (
                  <div key={att.id} className={style.fileItem}>
                    <span>{att.file.name}</span>
                    <button 
                      type="button" 
                      className={style.removeFile}
                      onClick={() => removeFile(att.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className={style.fileDescription}>
                Макс. 10 файлов по 5 МБ каждый<br/>
                Допустимые форматы: jpg, jpeg, png, webp, txt, log, docx, pdf, xlsx
              </div>
            </div>
          </div>

          <div className={style.formGroup}>
            <label className={style.formLabel}>
              Комментарий к заявке
            </label>
            <textarea
              className={style.formTextarea}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Дополнительная информация..."
            />
          </div>

          {error && <div className={style.error}>{error}</div>}

          <div className={style.buttonGroup}>
            <button 
              className={style.submitBtn} 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Создать обращение'}
            </button>
            <button 
              type="button" 
              className={style.cancelBtn}
              onClick={() => navigate('/')}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTicketPage
