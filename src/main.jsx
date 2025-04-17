import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './App.css'
import { RouterProvider } from 'react-router'
// import App from './App.jsx'


import { router } from './router/router'
import { AuthProvider } from './context/AuthContext'
import Tets from './components/Tets'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <RouterProvider router={router} /> */}
    
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider> 
  </StrictMode>,
)
