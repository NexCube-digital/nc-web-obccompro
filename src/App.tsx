import { Suspense, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import LoadingState from './components/ui/modal/LoadingState'
import WhatsAppIcon from './components/ui/WhatsAppIcon'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from 'sonner'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading ? (
        <LoadingState onComplete={() => setIsLoading(false)} />
      ) : (
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
      )}
      <Toaster position="top-right" richColors duration={3000} closeButton />
    </>
  )
}

export default App
