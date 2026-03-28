import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { FavoritesProvider } from './context/FavoritesContext'
import { GlobalProvider } from './context/GlobalContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>
)
