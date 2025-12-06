import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-100 p-5 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition text-center">
      <div className="mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md"
        />
      </div>

      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

      <p className="text-gray-600 text-sm mb-3">
        ${Number(product.price).toFixed(2)}
      </p>

      <div className="flex gap-2 justify-center">
        <Link to={`/product/${product.id}`} className="btn-small">
          View Details
        </Link>

        {onAddToCart && (
          <button className="btn-small" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
