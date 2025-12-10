import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const { state } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to home
    if (state.isAuthenticated) {
      console.log("User authenticated, redirecting to home...");
      navigate("/", { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

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