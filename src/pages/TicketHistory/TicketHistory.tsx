// src/components/admin/TicketHistorySection.tsx
import React, { useState, useEffect } from 'react'
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

const TicketHistorySection = () => {
  const [history, setHistory] = useState<TicketHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await AdminService.getTicketHistory()
      setHistory(response.data)
    } catch (error) {
      console.error('Ошибка при загрузке истории:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        История изменений тикетов
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Тикет ID</TableCell>
              <TableCell>Изменил</TableCell>
              <TableCell>Тип изменения</TableCell>
              <TableCell>Дата изменения</TableCell>
              <TableCell>Старое значение</TableCell>
              <TableCell>Новое значение</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  История изменений отсутствует
                </TableCell>
              </TableRow>
            ) : (
              history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.ticket_id}</TableCell>
                  <TableCell>{record.changed_by}</TableCell>
                  <TableCell>{record.change_type}</TableCell>
                  <TableCell>
                    {new Date(record.changed_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{record.old_value}</TableCell>
                  <TableCell>{record.new_value}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TicketHistorySection
