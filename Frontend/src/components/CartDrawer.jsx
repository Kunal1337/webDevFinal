import React from "react";
import { useCart } from "../context/CartContext";

import "./CartDrawer.css"; // We'll create this next

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeItem, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      {/* Dark overlay */}
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      {/* Sliding drawer */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        {cart.length === 0 ? (
          <p className="empty">Your cart is empty</p>
        ) : (
          <>
            <ul className="drawer-list">
              {cart.map((item) => (
                <li key={item.id} className="drawer-item">
                  <img src={item.image} alt={item.name} />

                  <div className="item-meta">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>

                  <p className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    className="remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="drawer-footer">
              <p className="total">Total: ${total.toFixed(2)}</p>

              <button className="btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
