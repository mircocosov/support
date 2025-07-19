import { FILE_CONFIG } from '@/config/constants'

// Получить расширение файла
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

// Проверить, является ли файл изображением
export const isImageFile = (filename: string): boolean => {
  const extension = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)
}

// Проверить валидность файла
export const isValidFile = (file: File): boolean => {
  const extension = getFileExtension(file.name)
  return FILE_CONFIG.VALID_EXTENSIONS.includes(extension as any)
}

// Проверить размер файла
export const isValidFileSize = (file: File): boolean => {
  return file.size <= FILE_CONFIG.MAX_FILE_SIZE
}

// Форматировать размер файла
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Получить иконку файла по расширению
export const getFileIcon = (filename: string): string => {
  const extension = getFileExtension(filename)
  
  switch (extension) {
    case 'pdf':
      return '📄'
    case 'doc':
    case 'docx':
      return '📝'
    case 'xls':
    case 'xlsx':
      return '📊'
    case 'ppt':
    case 'pptx':
      return '📈'
    case 'txt':
      return '📃'
    case 'zip':
    case 'rar':
    case '7z':
      return '📦'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return '🖼️'
    case 'mp4':
    case 'avi':
    case 'mov':
      return '🎥'
    case 'mp3':
    case 'wav':
      return '🎵'
    default:
      return '📎'
  }
}

// Скачать файл
export const downloadFile = async (fileUrl: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(fileUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки файла')
    }
    
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Ошибка скачивания файла:', error)
    throw new Error('Ошибка скачивания файла')
  }
} 