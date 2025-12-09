import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { useAuthContext } from '@asgardeo/auth-react';


// Original images
import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.jpg";
import tagheuer from "../assets/Tagheuer1.avif";

// New watches
import classicSilver from "../assets/watch-1silver.webp";
import luxuryGold from "../assets/watch-4.webp";
import sportyBlack from "../assets/watch-3.webp";

const API_BASE = "https://webdevfinal-2.onrender.com";

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

const Shop = () => {
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetchWatches();
  }, []);

  const fetchWatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/api/watches`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch watches: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Fetched watches:", data);
      setWatches(data);
    } catch (err) {
      console.error("Error fetching watches:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (watch) => {
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
    } catch (err) {
      console.error("Error adding to cart:", err);
      throw err;
    }
  };

  // Transform watch data for ProductCard component
  const transformWatchToProduct = (watch) => {
    const name = `${watch.brand} ${watch.model}`;
    const image = watch.image_url || imageMap[name] || gshock;
    
    return {
      id: watch.id,
      name: name,
      brand: watch.brand,
      model: watch.model,
      price: parseFloat(watch.price),
      description: watch.description,
      image: image,
      image_url: watch.image_url,
    };
  };

  if (loading) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Shop</h1>
          <p className="text-white">Loading watches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Shop</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error loading watches</p>
            <p>{error}</p>
            <button 
              onClick={fetchWatches}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Shop All Watches</h1>
        
        {watches.length === 0 ? (
          <div className="bg-white p-8 rounded-lg">
            <p className="text-gray-600 text-lg">No watches available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watches.map((watch) => (
              <ProductCard
                key={watch.id}
                product={transformWatchToProduct(watch)}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
