import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPage from '@/pages/Register'
import Login from '@/pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import CreateTicketPage from './pages/CreateTicket'
import AdminPage from './pages/Admin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/ticket/new',
    element: <CreateTicketPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
