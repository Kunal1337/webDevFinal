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

const API_BASE = "https://webdevfinal-ai.onrender.com/";

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
    <div>
      {/* Hero Section */}
      <section
        className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-cover bg-no-repeat bg-center h-80 flex justify-center items-center"
        style={{ backgroundImage: `url(${submariner})`}}
      >
        <div className="text-center">
          <h1 className="text-5xl font-black text-white mb-4">Timeless Watches</h1>
          <p className="text-xl text-white mb-6">Discover our premium collection of watches crafted with precision.</p>
          <Link to="/shop" className="btn">Shop Now</Link>
        </div>
      </section>

      {/* Featured Products */}
      <div className="w-full bg-brandNavy mx-auto px-12 pt-10">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-5">Featured Watches</h2>
          <div className="grid grid-cols-3 gap-6">

            {featured.length === 0 ? (
              <p className="text-white">No featured watches available.</p>
            ) : (
              featured.map((watch) => {
                const name = `${watch.brand} ${watch.model}`;

                return (
                  <div className="bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-100 p-5 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition text-center" key={watch.id}>
                    <img
                      src={imageMap[name] || gshock}
                      alt={name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-gray-600 text-sm mb-3">${watch.price}</p>
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
        <section className="mt-20 text-center px-10 py-10 bg-gray-100 rounded-lg mb-12">
          <h2 className="text-3xl font-bold mb-3">Stay Stylish, Stay on Time</h2>
          <p className="mb-4">Sign up for our newsletter and get exclusive offers on new arrivals.</p>
          <Link to="/shop" className="btn">Shop the Collection</Link>
        </section>
      </div>
    </div>
  );
};

export default Home;