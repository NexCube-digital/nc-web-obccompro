import { Suspense, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import LoadingState from './components/ui/LoadingState'
import WhatsAppIcon from './components/common/WhatsAppIcon'
import AppRoutes from './routes/AppRoutes'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  if (isLoading) {
    return <LoadingState onComplete={() => setIsLoading(false)} />
  }

  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-obc-ivory font-body text-sm text-obc-muted" role="status" aria-live="polite">
            Memuat halaman...
          </div>
        }
      >
        <Routes>
          {AppRoutes}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <WhatsAppIcon />
    </>
  )
}

export default App
