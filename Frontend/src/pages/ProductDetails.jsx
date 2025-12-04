import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import gshock from "../assets/gshock1.webp";
import omega from "../assets/omega1.webp";
import submariner from "../assets/Submariner1.jpg";
import tagheuer from "../assets/Tagheuer1.avif";

const imageMap = {
  "Casio G-Shock": gshock,
  "Omega Speedmaster": omega,
  "Rolex Submariner": submariner,
  "Tag Heuer Carrera": tagheuer,
};

const API_BASE = "https://webdevfinal-1.onrender.com";

const ProductDetails = () => {
  const { id } = useParams();
  const [watch, setWatch] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/watches/${id}`)
      .then((res) => res.json())
      .then((data) => setWatch(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!watch) return <div className="w-full bg-brandNavy px-12 py-6"><h2 className="text-white">Loading...</h2></div>;

  const imgKey = `${watch.brand} ${watch.model}`;
  const watchImage = imageMap[imgKey];

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

          <Link to="/shop" className="btn inline-block">
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
