import { Link } from "react-router-dom";

export default function Navbar({ isAuthenticated, username, onSignIn, onSignOut }) {
  const handleSignIn = async () => {
    try {
      await onSignIn();
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Failed to sign in: " + (error.message || "Unknown error"));
    }
  };

  const handleSignOut = async () => {
    try {
      await onSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out: " + (error.message || "Unknown error"));
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Watch US Go</Link>

        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/shop" className="navbar-link">Shop</Link></li>
          <li><Link to="/about" className="navbar-link">About</Link></li>
          <Link to="/orders" className="navbar-link">Orders</Link>
          <li><Link to="/contact" className="navbar-link">Contact</Link></li>
        </ul>

        <div className="navbar-actions">
          
          <Link to="/cart" className="navbar-action-link">Cart</Link>
          
          {isAuthenticated ? (
            <>
              {username && (
                <span className="text-sm text-gray-600 font-medium">
                  {username}
                </span>
              )}
              <button 
                onClick={handleSignOut}
                className="navbar-action-link"
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={handleSignIn}
              className="navbar-action-link"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}