import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <h3>{product.name}</h3>
      <p>${Number(product.price).toFixed(2)}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Link to={`/product/${product.id}`} className="btn-small">
          View Details
        </Link>

        {onAddToCart ? (
          <button className="btn-small" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;
