import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CartPanel from "../components/CartPanel";
import { useCart } from "../context/CartContext";

// Original images
import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.jpg";
import tagheuer from "../assets/Tagheuer1.avif";

// New images
import classicSilver from "../assets/watch-1silver.webp";
import luxuryGold from "../assets/watch-4.webp";
import sportyBlack from "../assets/watch-3.webp";

const API_BASE = "https://webdevfinal-ai.onrender.com/";

// Image dictionary
const watchImages = {
  "Casio G-Shock": gshock,
  "Omega Speedmaster": omega,
  "Rolex Submariner": submariner,
  "Tag Heuer Carrera": tagheuer,
  "Classic Silver": classicSilver,
  "Luxury Gold": luxuryGold,
  "Sporty Black": sportyBlack,
};

const Shop = () => {
  const [watches, setWatches] = useState([]);
  const { cart, removeItem, clearCart } = useCart(); // addItem is used inside ProductCard now

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
    <div className="w-full bg-brandNavy px-12 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">
        
        {/* LEFT SIDE — PRODUCTS */}
        <div className="col-span-3">
          <h1 className="text-3xl font-bold text-white mb-6">Shop Our Collection</h1>

          <div className="grid grid-cols-3 gap-6">
            {watches.length === 0 ? (
              <p className="text-white">No watches available yet.</p>
            ) : (
              watches.map((watch) => {
                const name = `${watch.brand} ${watch.model}`;

                return (
                  <ProductCard
                    key={watch.id}
                    product={{
                      ...watch,  // contains brand, model, price, description, id
                      name,
                      image: watchImages[name] || gshock, // fallback
                    }}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT SIDE — CART */}
        <div>
          <CartPanel 
            cart={cart}
            onRemove={removeItem}
            onClear={clearCart}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;
