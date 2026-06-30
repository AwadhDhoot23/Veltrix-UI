import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ComponentsProvider } from './context/ComponentsContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ComponentsProvider>
          <App />
        </ComponentsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
