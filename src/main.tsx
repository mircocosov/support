import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPage from '@/pages/Register'
import Login from '@/pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import CreateTicketPage from './pages/CreateTicket'
import AdminPage from './pages/Admin'
import LogoutPage from './pages/Logout'
import TicketPage from './pages/TicketPage/TicketPage'
import AllTicketsPage from './pages/AllTicketsPage/AllTicketsPage'
import SupportPage from './pages/SupportPage/SupportPage'

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
    path: '/tickets',
    element: <AllTicketsPage />,
  },
  {
    path: '/ticket/new',
    element: <CreateTicketPage />,
  },
  {
    path: '/ticket/:id',
    element: <TicketPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/logout',
    element: <LogoutPage />,
  },
  {
    path: '/support',
    element: <SupportPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
