import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import Summary from './pages/Summary'
import DailyLog from './pages/DailyLog'
import More from './pages/More'
import Login from './pages/Login'
import Health from './pages/Health'   // 👈 aggiunta
import './styles.css'
import './i18n'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DailyLog /> },
      { path: 'summary', element: <Summary /> },
      { path: 'more', element: <More /> },
      { path: 'settings', element: <More /> },
      { path: 'health', element: <Health /> },   // 👈 nuova pagina
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  },
  { path: '/login', element: <Login /> }
])

const client = new QueryClient()

function BootFallback() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--fg)',
      background: 'var(--bg)'
    }}>
      <div>Loading…</div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Suspense fallback={<BootFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
)
