import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@asgardeo/auth-react'
import './index.css'
import App from './App.jsx'

const isLocalhost = window.location.hostname === "localhost";

// Remove trailing slash from production URL
const redirectURL = isLocalhost
  ? "http://localhost:5173"
  : "https://watch-ecommerce-ttrm.onrender.com";

const config = {
  signInRedirectURL: redirectURL + "/login",
  signOutRedirectURL: redirectURL,
  clientID: "jtzI2YwwPGhL9hhiEpXOvRWC3rca",
  baseUrl: "https://api.asgardeo.io/t/watchesio",
  scope: ["openid", "profile", "email"],
  resourceServerURLs: [],
  enablePKCE: true,
  disableTrySignInSilently: true,
  storage: "localStorage"
};

console.log("🔧 Asgardeo Config:", {
  signInRedirectURL: config.signInRedirectURL,
  signOutRedirectURL: config.signOutRedirectURL,
  environment: isLocalhost ? "local" : "production"
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  </StrictMode>
);