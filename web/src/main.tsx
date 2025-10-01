import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import Summary from './pages/Summary'
import DailyLog from './pages/DailyLog'
import More from './pages/More'
import Login from './pages/Login'
import './styles.css'
import './i18n' // 👈 inizializza i18n

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DailyLog /> },
      { path: 'summary', element: <Summary /> },
      { path: 'more', element: <More /> },
      { path: 'settings', element: <More /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  },
  { path: '/login', element: <Login /> }
])

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
