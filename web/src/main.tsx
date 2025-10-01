import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import Summary from './pages/Summary'
import DailyLog from './pages/DailyLog'
import More from './pages/More'
import Login from './pages/Login'
import Health from './pages/Health'     // health page
import ErrorBoundary from './components/ErrorBoundary'
import './styles.css'
import './i18n'

const appRoutes = {
  path: '/',
  element: <App />,
  children: [
    { index: true, element: <DailyLog /> },
    { path: 'summary', element: <Summary /> },
    { path: 'more', element: <More /> },
    { path: 'settings', element: <More /> },
    { path: '*', element: <Navigate to="/" replace /> }
  ]
}

const router = createBrowserRouter([
  appRoutes,
  // Health è anche top-level: si apre pure se App avesse errori
  { path: '/health', element: <Health /> },
  { path: '/login', element: <Login /> }
])

const client = new QueryClient()

function BootFallback() {
  return (
    <div style={{minHeight:'100dvh',display:'grid',placeItems:'center',color:'var(--fg)',background:'var(--bg)'}}>
      <div>Loading…</div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <Suspense fallback={<BootFallback />}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
)
// 👇 segnala al boot HTML che React ha montato
document.documentElement.setAttribute('data-app-mounted', '1')
