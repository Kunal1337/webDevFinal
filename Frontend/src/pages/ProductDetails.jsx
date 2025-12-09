import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.jpg";
import tagheuer from "../assets/Tagheuer1.avif";

// New watches
import classicSilver from "../assets/watch-1silver.webp";
import luxuryGold from "../assets/watch-4.webp";
import sportyBlack from "../assets/watch-3.webp";

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

const API_BASE = "https://webdevfinal-2.onrender.com";

const ProductDetails = () => {
  const { id } = useParams();
  const [watch, setWatch] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`${API_BASE}/api/watches/${id}`)
      .then((res) => res.json())
      .then((data) => setWatch(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = async () => {
    if (!watch) return;

    setIsAdding(true);
    setAddSuccess(false);

    try {
      // Use CartContext's addItem which handles the API call with auth
      const name = `${watch.brand} ${watch.model}`;
      const image = watch.image_url || imageMap[name] || gshock;
      
      await addItem({
        id: watch.id,
        name: name,
        brand: watch.brand,
        model: watch.model,
        price: parseFloat(watch.price),
        description: watch.description,
        image: image,
        image_url: watch.image_url,
      });

      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(err.message || "Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  if (!watch) return <div className="w-full bg-brandNavy px-12 py-6"><h2 className="text-white">Loading...</h2></div>;

  const imgKey = `${watch.brand} ${watch.model}`;
  const watchImage = watch.image_url || imageMap[imgKey] || gshock;

  return (
    <div className="w-full bg-brandNavy px-12 py-6">
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-10">
        <div>
          <img src={watchImage} alt={imgKey} className="w-full rounded-lg shadow-lg" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-3">{watch.brand} {watch.model}</h1>
          <p className="text-3xl font-bold text-primary mb-6">${Number(watch.price).toFixed(2)}</p>

          <p className="text-lg text-gray-200 leading-relaxed mb-8">{watch.description}</p>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`btn ${addSuccess ? 'bg-green-600' : ''} ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAdding ? 'Adding...' : addSuccess ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <Link to="/shop" className="btn inline-block bg-gray-600 hover:bg-gray-700">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
