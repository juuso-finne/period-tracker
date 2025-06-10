import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import __GlobalAppProvider__ from './control/providers/__GlobalAppProvider__.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <__GlobalAppProvider__>
      <App />
    </__GlobalAppProvider__>
  </StrictMode>,
)
