import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import DailyLog from './pages/DailyLog'
import Summary from './pages/Summary'
import More from './pages/More'   // <— nuova pagina
import './styles.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DailyLog /> },
      { path: 'summary', element: <Summary /> },
      { path: 'more', element: <More /> },

      // ALIAS: se il vecchio tab punta a /settings, serviamo comunque la nuova pagina
      { path: 'settings', element: <More /> },

      // opzionale: redirect esplicito
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  { path: '/login', element: <div /> }, // mantieni la tua pagina di login reale se diversa
])

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
