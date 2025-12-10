import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToCart = async () => {
    if (!onAddToCart) {
      console.error("Add to cart callback not provided");
      setError("Add to cart function not available");
      return;
    }

    if (!product.id) {
      console.error("❌ Product ID is missing!");
      setError("Product ID is missing");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      await onAddToCart(product);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add item");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
        
        {showSuccess && (
          <div className="product-success-overlay">
            <span className="success-text">✓ Added!</span>
          </div>
        )}
        
        {error && (
          <div className="product-error-overlay">
            <span className="error-text">{error}</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {product.description && (
          <p className="product-description">
            {product.description}
          </p>
        )}

        <p className="product-price">
          ${Number(product.price).toFixed(2)}
        </p>

        <div className="product-actions">
          <Link 
            to={`/product/${product.id}`}
            className="product-details-btn"
          >
            View Details
          </Link>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="product-add-btn"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;