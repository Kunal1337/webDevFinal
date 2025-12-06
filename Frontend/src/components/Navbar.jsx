import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Watch US Go</Link>

        <ul className="navbar-menu">
          <li><Link to="/" className="navbar-link">Home</Link></li>
          <li><Link to="/shop" className="navbar-link">Shop</Link></li>
          <li><Link to="/about" className="navbar-link">About</Link></li>
          <li><Link to="/contact" className="navbar-link">Contact</Link></li>
        </ul>

        <div className="navbar-actions">
          <Link to="/cart" className="navbar-action-link">Cart</Link>
          <Link to="/login" className="navbar-action-link">Login</Link>
        </div>
      </div>
    </nav>
  );
}