import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CartPanel from "../components/CartPanel";
import { useCart } from "../context/CartContext";

// Original images
import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.jpg";
import tagheuer from "../assets/Tagheuer1.avif";

// New images you added
import classicSilver from "../assets/watch-1silver.webp";
import luxuryGold from "../assets/watch-4.webp";
import sportyBlack from "../assets/watch-3.webp";

// IMPORTANT: No trailing slash
const API_BASE = "https://webdevfinal-1.onrender.com";

// Image dictionary so each DB watch maps to the right photo
const watchImages = {
  "Casio G-Shock": gshock,
  "Omega Speedmaster": omega,
  "Rolex Submariner": submariner,
  "Tag Heuer Carrera": tagheuer,

  // New seed watches
  "Classic Silver": classicSilver,
  "Luxury Gold": luxuryGold,
  "Sporty Black": sportyBlack,
};

const Shop = () => {
  const [watches, setWatches] = useState([]);
  const { cart, addItem, removeItem, clearCart } = useCart();

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
    <div className="shop-page page-container" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
      <div>
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
                onAddToCart={addItem}
              />
            );
          })
        )}
        </div>
      </div>

      <CartPanel cart={cart} onRemove={removeItem} onClear={clearCart} />
    </div>
  );
};

export default Shop;
