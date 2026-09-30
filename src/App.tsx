import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './components/common/ScrollToTop'
import WhatsAppIcon from './components/common/WhatsAppIcon'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {AppRoutes}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <WhatsAppIcon />
    </>
  )
}

export default App
