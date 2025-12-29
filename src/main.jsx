import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"

// Defensive reset: ensure no leftover body overflow styles block scrolling
if (typeof document !== 'undefined') {
  document.body.style.overflow = '';
}

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
     <App />
  </BrowserRouter>
    
  
)
