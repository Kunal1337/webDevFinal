import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.jpg";
import tagheuer from "../assets/Tagheuer1.avif";


const API_BASE = "http://localhost:3001"; 
// ⬆️ change to your Render backend later when deployed

// Map DB names → images
const watchImages = {
  "Casio G-Shock": gshock,
  "Omega Speedmaster": omega,
  "Rolex Submariner": submariner,
  "Tag Heuer Carrera": tagheuer,

  // NEW watches seeded into DB
  "Classic Silver": classicSilver,
  "Luxury Gold": luxuryGold,
  "Sporty Black": sportyBlack,
};

const Shop = () => {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/watches`)
      .then(res => res.json())
      .then(data => setWatches(data))
      .catch(err => console.error("Error fetching watches:", err));
  }, []);

  return (
    <div className="shop-page">
      <h1>Shop Our Collection</h1>

      <div className="products-grid">
        {watches.length === 0 ? (
          <p>No watches available yet.</p>
        ) : (
          watches.map(watch => (
            <ProductCard
             key={watch.id}
              product={{
                   id: watch.id,
                   name: `${watch.brand} ${watch.model}`,
                   price: watch.price,
                   image: watchImages[`${watch.brand} ${watch.model}`] || gshock, 
                   description: watch.description,
  }}
/>
          ))
        )}
      </div>
    </div>
  );
};

export default Shop;
