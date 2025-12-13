import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const { state, signIn } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔐 Login component mounted");
    console.log("📍 Current URL:", window.location.href);
    console.log("🔑 Auth state:", state);
    console.log("📦 Location search:", location.search);

    // Check for error in URL (from Asgardeo)
    const urlParams = new URLSearchParams(location.search);
    const oauthError = urlParams.get('oauthErrorCode');
    const errorMsg = urlParams.get('oauthErrorMsg');
    
    if (oauthError || errorMsg) {
      console.error("🚨 OAuth Error from URL:", { oauthError, errorMsg });
      setError(`OAuth Error: ${oauthError || 'Unknown'} - ${errorMsg || 'Check Asgardeo configuration'}`);
      return;
    }

    // If already authenticated, redirect to home
    if (state.isAuthenticated) {
      console.log("✅ User authenticated, redirecting to home...");
      navigate("/", { replace: true });
      return;
    }

    // If there's a code in the URL, Asgardeo should handle it automatically
    const code = urlParams.get('code');
    
    if (code) {
      console.log("🔄 Authorization code detected, waiting for Asgardeo to process...");
      // The @asgardeo/auth-react library handles this automatically
    } else {
      console.log("❌ No code found, user needs to sign in");
    }

    // Check for auth errors
    if (state.error) {
      console.error("🚨 Auth error:", state.error);
      setError(state.error.message || JSON.stringify(state.error));
    }
  }, [state.isAuthenticated, state.error, navigate, location]);

  // If there's an error, show it with detailed info
  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        flexDirection: "column",
        gap: "20px",
        padding: "20px"
      }}>
        <h2 style={{ color: "red" }}>Authentication Error</h2>
        <div style={{ 
          backgroundColor: "#ffe6e6", 
          padding: "20px", 
          borderRadius: "8px",
          maxWidth: "600px",
          wordBreak: "break-word"
        }}>
          <p><strong>Error:</strong> {error}</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Expected Redirect URL in Asgardeo:</strong> https://webdevfinal-f.onrender.com/login</p>
        </div>
        <button 
          onClick={() => {
            setError(null);
            window.location.href = "/";
          }}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Show loading state
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      flexDirection: "column",
      gap: "20px"
    }}>
      <div className="spinner" style={{
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite"
      }}></div>
      <h2>Completing your login...</h2>
      <p style={{ color: "#666" }}>Please wait while we authenticate you.</p>
      <div style={{ 
        marginTop: "20px",
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "5px",
        fontSize: "12px"
      }}>
        <p>Current URL: {window.location.href}</p>
        <p>Auth State: {state.isLoading ? "Loading..." : state.isAuthenticated ? "Authenticated" : "Not authenticated"}</p>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Login;