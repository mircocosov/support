import { useState, useEffect, useCallback } from 'react'
import { AdminService } from '@/api/hooks'
import { User } from '@/types'
import style from './UsersSection.module.scss'
import Notifications from '@/components/Notifications/Notifications'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

const UsersSection = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const navigate = useNavigate()

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

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(event.target.value)
  }

  return (
    <div className={style.usersSection}>
      <div className={style.topBar}>
        <div className={style.topBarRight}>
          <Button type="text" className={style.notificationsBtn}>
            <Notifications onNavigateToTicket={(ticketId) => navigate(`/ticket/${ticketId}`)} />
          </Button>
          <Button type="text" onClick={() => navigate('/logout')} className={style.logoutBtn}>
            Выйти
          </Button>
        </div>
      </div>
      <div className={style.headerRow}>
        <h2 className={style.title}>Управление пользователями</h2>
        <div className={style.roleFilterWrap}>
          <label htmlFor="roleFilter" className={style.roleFilterLabel}>Фильтр по роли:</label>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={handleFilterChange}
            className={style.roleFilterSelect}
          >
            <option value="all">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="support">Поддержка</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
      </div>
      <table className={style.usersTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя пользователя</th>
            <th>Email</th>
            <th>Роль</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className={style.loadingCell}>Загрузка...</td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={4} className={style.noUsersCell}>Пользователи не найдены</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value as User['role'])}
                    className={style.roleSelect}
                  >
                    <option value="user">Пользователь</option>
                    <option value="support">Поддержка</option>
                    <option value="admin">Администратор</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UsersSection
