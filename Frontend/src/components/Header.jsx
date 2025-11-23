import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Watch Us Go</Link>
      </div>

      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      <div className="header-actions">
        <Link to="/cart" className="cart">
          🛒 Cart
        </Link>
        <Link to="/login" className="login">
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;
