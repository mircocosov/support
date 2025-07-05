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
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { API_BASE_URL, API_ENDPOINTS } from '@/api/config/apiConfig'
import { refreshToken } from '@/types/auth'
import { createTicketAPI, TicketCategory } from '@/types/ticket'

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

  // Fetch categories
  useEffect(() => {
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
  }, [])

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
          navigate('/tickets?created=true')
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

  return (
    <div>
      <h1>Создать обращение</h1>

      {categoriesError && (
        <div>
          <strong>Внимание:</strong> {categoriesError}
        </div>
      )}

      {error && (
        <div>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <h2>Основная информация</h2>

          <div>
            <label htmlFor="subject">Тема обращения*</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Краткое описание проблемы..."
              required
            />
          </div>

          <div>
            <label htmlFor="description">Описание проблемы*</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробно опишите проблему..."
              rows={5}
              required
            />
          </div>
        </div>

        <div>
          <h2>Категория*</h2>

          {loadingCategories ? (
            <div>Загрузка категорий...</div>
          ) : (
            <>
              {categories.length > 0 ? (
                <select
                  value={category || ''}
                  onChange={(e) => setCategory(Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    Выберите категорию
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div>
                  <p>Категории не загружены. Пожалуйста, обновите страницу.</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                  >
                    Обновить
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <h2>Вложения</h2>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon icon="upload" />
            <p>Нажмите или перетащите файлы для загрузки</p>
            <p>
              Макс. {MAX_FILES} файлов по {MAX_FILE_SIZE / 1024 / 1024} МБ
              каждый
            </p>
            <p>Допустимые форматы: {VALID_EXTENSIONS.join(', ')}</p>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept={VALID_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
            style={{ display: 'none' }}
          />

          {attachments.length > 0 && (
            <div>
              <h3>Прикрепленные файлы:</h3>
              <ul>
                {attachments.map((attachment) => (
                  <li key={attachment.id}>
                    <Icon icon="file" />
                    <span>{attachment.file.name}</span>
                    <span>
                      ({(attachment.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(attachment.id)}
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h2>Комментарий к заявке</h2>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Дополнительная информация..."
            rows={3}
          />
        </div>

        <div>
          <Button
            type="primary"
            isDisabled={
              isSubmitting || loadingCategories || categories.length === 0
            }
          >
            {isSubmitting ? 'Отправка...' : 'Создать обращение'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreateTicketPage
