import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/api/hooks/useAuth'

const Home = () => {
  const { user, isAuthenticated, loading, initialCheckDone } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!initialCheckDone || loading) return

    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    } else if (user?.role === 'admin') {
      navigate('/admin', { replace: true })
    } else if (user?.role === 'support') {
      navigate('/support', { replace: true })
    }
  }, [user, isAuthenticated, loading, initialCheckDone, navigate])

  if (!initialCheckDone || loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="home-page">
      <h1>Welcome, {user?.username}</h1>
    </div>
  )
}

export default Home
