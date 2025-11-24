import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Original images
import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.jpg";
import tagheuer from "../assets/Tagheuer1.avif";

// New watches
import classicSilver from "../assets/watch-1silver.webp";
import luxuryGold from "../assets/watch-4.webp";
import sportyBlack from "../assets/watch-3.webp";

const API_BASE = "https://webdevfinal-1.onrender.com";

// Map brand+model → correct image
const imageMap = {
  // New seed watches
  "Classic Silver": classicSilver,
  "Luxury Gold": luxuryGold,
  "Sporty Black": sportyBlack,

  // Original DB watches
  "Casio G-Shock": gshock,
  "Omega Speedmaster": omega,
  "Rolex Submariner": submariner,
  "Tag Heuer Carrera": tagheuer,
};

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/watches`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched watches for home:", data);
        setFeatured(data.slice(0, 3)); // top 3 watches
      })
      .catch((err) => console.error("Error fetching watches:", err));
  }, []);

  return (
    <div className="home-page">

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${submariner})` }}
      >
        <div className="hero-content">
          <h1>Timeless Watches</h1>
          <p>Discover our premium collection of watches crafted with precision.</p>
          <Link to="/shop" className="btn">Shop Now</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Watches</h2>
        <div className="products-grid">

          {featured.length === 0 ? (
            <p>No featured watches available.</p>
          ) : (
            featured.map((watch) => {
              const name = `${watch.brand} ${watch.model}`;

              return (
                <div className="product-card" key={watch.id}>
                  <img
                    src={imageMap[name] || gshock}
                    alt={name}
                    className="product-image"
                  />
                  <h3>{name}</h3>
                  <p>${watch.price}</p>
                  <Link to={`/product/${watch.id}`} className="btn-small">
                    View Details
                  </Link>
                </div>
              );
            })
          )}

        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Stay Stylish, Stay on Time</h2>
        <p>Sign up for our newsletter and get exclusive offers on new arrivals.</p>
        <Link to="/shop" className="btn">Shop the Collection</Link>
      </section>

    </div>
  );
};

export default Home;
