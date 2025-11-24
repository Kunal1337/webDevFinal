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

const API_BASE = "http://localhost:3001";

const ProductDetails = () => {
  const { id } = useParams();
  const [watch, setWatch] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/watches/${id}`)
      .then((res) => res.json())
      .then((data) => setWatch(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!watch) return <div className="page-container"><h2>Loading...</h2></div>;

  const imgKey = `${watch.brand} ${watch.model}`;
  const watchImage = imageMap[imgKey];

  return (
    <div className="page-container product-details-page">
      <div className="product-details-card">
        <div className="product-details-img-wrapper">
          <img src={watchImage} alt={imgKey} className="product-details-img" />
        </div>

        <div className="product-details-info">
          <h1 className="product-details-title">{watch.brand} {watch.model}</h1>
          <p className="product-details-price">${Number(watch.price).toFixed(2)}</p>

          <p className="product-details-desc">{watch.description}</p>

          <Link to="/shop" className="btn" style={{ marginTop: "20px" }}>
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
