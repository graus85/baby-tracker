import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App'
import Summary from './pages/Summary'
import DailyLog from './pages/DailyLog'
import More from './pages/More'
import Login from './pages/Login'
import Health from './pages/Health'

import AddPicker from './pages/add/AddPicker'
import FeedForm from './pages/add/FeedForm'
import WeightForm from './pages/add/WeightForm'
import HeightForm from './pages/add/HeightForm'
import DiaperForm from './pages/add/DiaperForm'
import VitaminForm from './pages/add/VitaminForm'
import SleepForm from './pages/add/SleepForm'
import OtherForm from './pages/add/OtherForm'

import ErrorBoundary from './components/ErrorBoundary'
import './styles.css'
import './i18n'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Summary /> },
      { path: 'daily', element: <DailyLog /> },
      { path: 'more', element: <More /> },
      { path: 'settings', element: <More /> },

      // add flow
      { path: 'add', element: <AddPicker /> },
      { path: 'add/feed', element: <FeedForm /> },
      { path: 'add/weight', element: <WeightForm /> },
      { path: 'add/height', element: <HeightForm /> },
      { path: 'add/diaper', element: <DiaperForm /> },
      { path: 'add/vitamin', element: <VitaminForm /> },
      { path: 'add/sleep', element: <SleepForm /> },
      { path: 'add/other', element: <OtherForm /> },

      { path: '*', element: <Navigate to="/" replace /> }
    ]
  },
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

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <Suspense fallback={<BootFallback />}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  </StrictMode>
)

document.documentElement.setAttribute('data-app-mounted', '1')
