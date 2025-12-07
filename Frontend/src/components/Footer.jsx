import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h4 className="footer-brand-title">Watch Us Go</h4>
        <p className="footer-brand-description">Premium watches delivered worldwide.</p>
      </div>

      <div className="footer-links-section">
        <h4 className="footer-links-title">Quick Links</h4>
        <ul className="footer-links">
          <li><Link to="/" className="footer-link">Home</Link></li>
          <li><Link to="/shop" className="footer-link">Shop</Link></li>
          <li><Link to="/about" className="footer-link">About</Link></li>
          <li><Link to="/contact" className="footer-link">Contact</Link></li>
        </ul>
      </div>

      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Watch Us Go. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;