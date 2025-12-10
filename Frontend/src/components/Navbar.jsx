import { Link } from "react-router-dom";

// Admin emails list
const ADMIN_EMAILS = ['watchesauth372@gmail.com'];

export default function Navbar({ isAuthenticated, username, onSignIn, onSignOut }) {
  const handleSignIn = async () => {
    try {
      await onSignIn();
    } catch (error) {
      console.error("Sign in error:", error);
      // User will see auth UI for retry
    }
  };

  const handleSignOut = async () => {
    try {
      await onSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      // User will see auth UI for retry
    }
  };

  // Check if user is admin
  const isAdmin = isAuthenticated && username && 
    ADMIN_EMAILS.includes(username.toLowerCase());

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Watch US Go</Link>

        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/shop" className="navbar-link">Shop</Link></li>
          <li><Link to="/about" className="navbar-link">About</Link></li>
          <li><Link to="/contact" className="navbar-link">Contact</Link></li>
          
          {/* Only show Orders if logged in */}
          {isAuthenticated && (
            <li><Link to="/orders" className="navbar-link">Orders</Link></li>
          )}
          
          {/* Only show Admin if user is admin */}
          {isAdmin && (
            <li><Link to="/admin" className="navbar-link">Admin</Link></li>
          )}
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