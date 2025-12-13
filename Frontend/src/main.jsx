import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@asgardeo/auth-react'
import './index.css'
import App from './App.jsx'

const isLocalhost = window.location.hostname === "localhost";

// Frontend URLs (where user logs in)
const redirectURL = isLocalhost
  ? "http://localhost:5173"
  : "https://webdevfinal-f.onrender.com";

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

// Log BEFORE creating root
console.log("=".repeat(80));
console.log("🔧 ASGARDEO CONFIGURATION 🔧");
console.log("=".repeat(80));
console.log("Environment:", isLocalhost ? "LOCAL" : "PRODUCTION");
console.log("Hostname:", window.location.hostname);
console.log("Sign In Redirect URL:", config.signInRedirectURL);
console.log("Sign Out Redirect URL:", config.signOutRedirectURL);
console.log("=".repeat(80));
console.log("⚠️  THE ABOVE URL MUST EXACTLY MATCH ASGARDEO SETTINGS! ⚠️");
console.log("=".repeat(80));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  </StrictMode>
);