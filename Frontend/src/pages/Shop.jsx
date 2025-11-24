import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

// Existing images
import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.jpg";
import tagheuer from "../assets/Tagheuer1.avif";

// New images you added
import classicSilver from "../assets/watch-1silver.webp"; 
import luxuryGold from "../assets/watch-4.webp";      
import sportyBlack from "../assets/watch-3.webp";       

// IMPORTANT: backend URL
const API_BASE = "https://webdevfinal-1.onrender.com";

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
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched watches:", data);
        setWatches(data);
      })
      .catch((err) => console.error("Error fetching watches:", err));
  }, []);

  return (
    <div className="shop-page">
      <h1>Shop Our Collection</h1>

      <div className="products-grid">
        {watches.length === 0 ? (
          <p>No watches available yet.</p>
        ) : (
          watches.map((watch) => {
            const name = `${watch.brand} ${watch.model}`;

            return (
              <ProductCard
                key={watch.id}
                product={{
                  id: watch.id,
                  name: name,
                  price: watch.price,
                  image: watchImages[name] || gshock, // fallback
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
