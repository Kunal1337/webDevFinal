import React from "react";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeItem, clearCart, increaseQty, decreaseQty } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <div
        className={`cart-drawer-overlay ${isOpen ? "cart-drawer-overlay-open" : ""}`}
        onClick={onClose}
      ></div>

      <div className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}>
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Your Cart</h2>
          <button className="cart-drawer-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="cart-drawer-empty">Your cart is empty</p>
        ) : (
          <>
            <ul className="cart-drawer-list">
              {cart.map((item) => {
                const itemName = item.name || `${item.brand} ${item.model}`;
                const itemImage = item.image || item.image_url;
                
                return (
                <li key={item.id} className="cart-drawer-item">
                  {itemImage ? (
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="cart-drawer-item-image"
                    />
                  ) : (
                    <div className="cart-drawer-item-image" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                      No Image
                    </div>
                  )}

                  <div className="cart-drawer-item-info">
                    <p className="cart-drawer-item-name">{itemName}</p>
                    <div className="cart-drawer-item-controls">
                      <button
                        className="cart-drawer-qty-btn"
                        onClick={() => decreaseQty(item.id)}
                      >
                        -
                      </button>
                      <span className="cart-drawer-qty-display">{item.quantity}</span>
                      <button
                        className="cart-drawer-qty-btn"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="cart-drawer-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    className="cart-drawer-remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </li>
              );
              })}
            </ul>

            <div className="cart-drawer-footer">
              <p className="cart-drawer-total">
                Total: ${total.toFixed(2)}
              </p>

              <button className="cart-drawer-clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}