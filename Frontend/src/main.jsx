import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@asgardeo/auth-react'
import './index.css'
import App from './App.jsx'

const config = {
  signInRedirectURL: "http://localhost:5173",
  signOutRedirectURL: "http://localhost:5173",
  clientID: "jtzI2YwwPGhL9hhiEpXOvRWC3rca",
  baseUrl: "https://api.asgardeo.io/t/watchesio",
  scope: ["openid", "profile", "email"]
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  </StrictMode>
);