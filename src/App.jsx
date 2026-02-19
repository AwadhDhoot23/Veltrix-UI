import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import ComponentsPage from './pages/ComponentsPage'
import HomePage from './pages/HomePage'
import ComponentDetailPage from './pages/ComponentDetailPage'
import Footer from './components/Footer'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation();
  return (
    <div className='text-white min-h-screen flex flex-col'>
      <main className='flex-1'>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route path="/components/:slug" element={<ComponentDetailPage />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
        <Footer />
      </main>
    </div>
  )
}

export default App
