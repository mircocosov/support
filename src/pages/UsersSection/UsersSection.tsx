import { useState, useEffect, useCallback } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
} from '@mui/material'
import { AdminService } from '@/api/hooks'
import { User } from '@/types'

const UsersSection = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const role =
        roleFilter === 'all' ? undefined : (roleFilter as User['role'])
      const usersData = await AdminService.getUsers(role)
      setUsers(usersData)
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error)
    } finally {
      setLoading(false)
    }
  }, [roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      await AdminService.updateUserRole(userId, { role: newRole })
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      )
    } catch (error) {
      console.error('Ошибка при обновлении роли:', error)
    }
  }

  const handleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Управление пользователями</Typography>

        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel>Фильтр по роли</InputLabel>
          <Select
            value={roleFilter}
            onChange={handleFilterChange}
            label="Фильтр по роли"
          >
            <MenuItem value="all">Все роли</MenuItem>
            <MenuItem value="user">Пользователь</MenuItem>
            <MenuItem value="support">Поддержка</MenuItem>
            <MenuItem value="admin">Администратор</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя пользователя</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <FormControl variant="outlined" size="small">
                      <Select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value as User['role'],
                          )
                        }
                      >
                        <MenuItem value="user">Пользователь</MenuItem>
                        <MenuItem value="support">Поддержка</MenuItem>
                        <MenuItem value="admin">Администратор</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        handleRoleChange(
                          user.id,
                          user.role === 'admin' ? 'user' : 'admin',
                        )
                      }
                    >
                      {user.role === 'admin' ? 'Понизить' : 'Повысить'}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default UsersSection
