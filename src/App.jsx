import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import ComponentsPage from './pages/ComponentsPage'
import HomePage from './pages/HomePage'
import ComponentDetailPage from './pages/ComponentDetailPage'
import Footer from './components/Footer'
import NotFound from './pages/NotFound'
import { ROUTES } from './utils/constants.js'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SubmitComponentPage from './pages/SubmitComponentPage';
import EditComponentPage from './pages/EditComponentPage';
import { Toaster } from 'sonner'

function App() {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/register', '/dashboard', '/submit'];
  const showFooter = !hideFooterPaths.includes(location.pathname);
  return (
    <div className='text-white min-h-screen flex flex-col'>
      <main className='flex-1'>
        <Toaster theme="dark" position="bottom-right" />
        <Routes location={location}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.COMPONENTS} element={<ComponentsPage />} />
          <Route path="/components/:slug" element={<ComponentDetailPage />} />
          <Route path="*" element={<NotFound/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/submit" element={<SubmitComponentPage />} />
          <Route path="/edit/:id" element={<EditComponentPage />} />
        </Routes>
        {showFooter && <Footer />}
      </main>
    </div>
  )
}

export default App
