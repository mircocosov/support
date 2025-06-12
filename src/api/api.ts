import axios from 'axios'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Добавим интерцептор для обработки ошибок
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  },
)
