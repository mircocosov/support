// src/components/admin/TicketHistorySection.tsx
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material'
import { AdminService } from '@/api/hooks/useAdmin'
import { TicketHistory } from '@/types/admin'
import style from './TicketHistory.module.scss'

const TicketHistorySection = () => {
  const [history, setHistory] = useState<TicketHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const data = await AdminService.getTicketHistory()
      setHistory(data)
    } catch (error) {
      console.error('Ошибка при загрузке истории:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={style.ticketHistorySection}>
      <h2 className={style.title}>История изменений тикетов</h2>
      <table className={style.historyTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Тикет ID</th>
            <th>Изменил</th>
            <th>Тип изменения</th>
            <th>Дата изменения</th>
            <th>Старое значение</th>
            <th>Новое значение</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>Загрузка...</td>
            </tr>
          ) : history.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center' }}>История изменений отсутствует</td>
            </tr>
          ) : (
            history.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.ticket_id}</td>
                <td>{record.changed_by}</td>
                <td>{record.change_type}</td>
                <td>{new Date(record.changed_at).toLocaleString()}</td>
                <td>{record.old_value}</td>
                <td>{record.new_value}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TicketHistorySection
