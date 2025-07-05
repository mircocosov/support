import { useState, useEffect } from 'react'
import { Box, Tab, Tabs, CircularProgress, Typography } from '@mui/material'
import CategoriesSection from '@/pages/CategoriesSection'
import TicketHistorySection from '@/pages/TicketHistory'
import UsersSection from '@/pages/UsersSection'
import { useAuth } from '@/api/hooks'
import { useNavigate } from 'react-router-dom'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { user, isAuthenticated, initialCheckDone } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (initialCheckDone && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/login')
    }
  }, [isAuthenticated, user, initialCheckDone, navigate])

  if (!initialCheckDone) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (user?.role !== 'admin') {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          У вас недостаточно прав для доступа к этой странице
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Только администраторы могут просматривать эту страницу
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Категории" />
        <Tab label="История тикетов" />
        <Tab label="Пользователи" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <CategoriesSection />}
        {activeTab === 1 && <TicketHistorySection />}
        {activeTab === 2 && <UsersSection />}
      </Box>
    </Box>
  )
}

export default AdminPage
