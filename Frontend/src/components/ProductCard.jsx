import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <h3>{product.name}</h3>
      <p>${Number(product.price).toFixed(2)}</p>
      <Link to={`/product/${product.id}`} className="btn-small">
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
