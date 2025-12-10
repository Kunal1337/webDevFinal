import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const { state, signIn } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (state.isAuthenticated) {
      navigate("/");
    }
  }, [state.isAuthenticated, navigate]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh" 
    }}>
      <div style={{ textAlign: "center" }}>
        <h2>Logging you in...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default Login;