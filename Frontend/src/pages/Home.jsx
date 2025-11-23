import React from 'react';
import { Link } from 'react-router-dom';

import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.webp";

const Home = () => {
  return (
    <div className="home-page">

      {/* ---------- HERO ---------- */}
      <section 
        className="hero" 
        style={{ backgroundImage: `url(${submariner})` }}
      >
        <div className="hero-content">
          <h1>Timeless Watches</h1>
          <p>Premium craftsmanship. Unmatched style. Explore our finest collection today.</p>
          <Link to="/shop" className="btn">Shop Now</Link>
        </div>
      </section>

      {/* ---------- FEATURED PRODUCTS ---------- */}
      <section className="featured-products page-container">
        <h2>Featured Watches</h2>

        <div className="products-grid">

          {/* G-Shock */}
          <div className="product-card">
            <div className="product-image-wrapper">
              <img src={gshock} alt="Casio G-Shock" className="product-image" />
            </div>
            <h3>Casio G-Shock</h3>
            <p>$120.00</p>
            <Link to="/shop" className="btn-small">Buy Now</Link>
          </div>

          {/* Omega */}
          <div className="product-card">
            <div className="product-image-wrapper">
              <img src={omega} alt="Omega Speedmaster" className="product-image" />
            </div>
            <h3>Omega Speedmaster</h3>
            <p>$5200.00</p>
            <Link to="/shop" className="btn-small">Buy Now</Link>
          </div>

          {/* Rolex Submariner */}
          <div className="product-card">
            <div className="product-image-wrapper">
              <img src={submariner} alt="Rolex Submariner" className="product-image" />
            </div>
            <h3>Rolex Submariner</h3>
            <p>$9150.00</p>
            <Link to="/shop" className="btn-small">Buy Now</Link>
          </div>

        </div>
      </section>

      {/* ---------- CALL TO ACTION ---------- */}
      <section className="cta page-container">
        <h2>Stay Stylish, Stay On Time</h2>
        <p>Join our newsletter for exclusive offers and new arrivals.</p>
        <Link to="/shop" className="btn">Explore Collection</Link>
      </section>

    </div>
  );
};

export default Home;
