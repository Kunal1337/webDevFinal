import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="logo">Watch US Go</Link>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="nav-right">
          <Link to="/cart" className="cart">Cart</Link>
          <Link to="/login" className="login">Login</Link>
        </div>
      </div>
    </nav>
  );
}