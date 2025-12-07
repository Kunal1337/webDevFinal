import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeItem, clearCart, increaseQty, decreaseQty, loading } = useCart();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-loading">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Your Cart</h1>
          <div className="cart-empty">
            <p className="cart-empty-text">Your cart is empty</p>
            <Link to="/shop" className="btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>

        <div className="cart-card">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={`${item.brand} ${item.model}`}
                      className="cart-item-img"
                    />
                  ) : (
                    <div className="cart-item-no-image">
                      No Image
                    </div>
                  )}
                </div>

                <div className="cart-item-info">
                  <h3 className="cart-item-name">
                    {item.brand} {item.model}
                  </h3>
                  <p className="cart-item-price">${item.price}</p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p className="item-total-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span className="total-label">Total:</span>
              <span className="total-amount">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="cart-actions">
              <button
                onClick={clearCart}
                className="clear-cart-btn"
              >
                Clear Cart
              </button>
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>

            <Link to="/shop" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;