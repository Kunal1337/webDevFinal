import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.webp";
import tagheuer from "../assets/Tagheuer1.avif";

// IMPORTANT: No trailing slash
const API_BASE = "https://webdevfinal-1.onrender.com";

const watchImages = {
  "Casio G-Shock": gshock,
  "Omega Speedmaster": omega,
  "Rolex Submariner": submariner,
  "Tag Heuer Carrera": tagheuer,
};

const Shop = () => {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/watches`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched watches:", data); // Debug log
        setWatches(data);
      })
      .catch(err => console.error("Error fetching watches:", err));
  }, []);

  return (
    <div className="shop-page">
      <h1>Shop Our Collection</h1>

      <div className="products-grid">
        {watches.length === 0 ? (
          <p>No watches available yet.</p>
        ) : (
          watches.map(watch => {
            const name = `${watch.brand} ${watch.model}`;
            return (
              <ProductCard
                key={watch.id}
                product={{
                  id: watch.id,
                  name: name,
                  price: watch.price,
                  image: watchImages[name] || gshock,
                  description: watch.description,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Shop;
