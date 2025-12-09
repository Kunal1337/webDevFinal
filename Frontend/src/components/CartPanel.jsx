import React from 'react';
import { useCart } from '../context/CartContext';

const CartPanel = ({ cart, onRemove, onClear }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { increaseQty, decreaseQty } = useCart();

  return (
    <aside className="cart-panel">
      <h3 className="cart-panel-title">Your Cart</h3>
      {cart.length === 0 ? (
        <p className="cart-panel-empty">Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-panel-list">
            {cart.map(item => {
              const itemName = item.name || `${item.brand} ${item.model}`;
              const itemImage = item.image || item.image_url;
              
              return (
              <li key={item.id} className="cart-panel-item">
                {itemImage ? (
                  <img 
                    src={itemImage} 
                    alt={itemName} 
                    className="cart-panel-item-image" 
                  />
                ) : (
                  <div className="cart-panel-item-image" style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    No Image
                  </div>
                )}
                <div className="cart-panel-item-info">
                  <div className="cart-panel-item-name">{itemName}</div>
                  <div className="cart-panel-item-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => decreaseQty(item.id)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => increaseQty(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-panel-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="cart-panel-remove-btn" 
                  onClick={() => onRemove(item.id)}
                >
                  Remove
                </button>
              </li>
            );
            })}
          </ul>
          <div className="cart-panel-total">Total: ${total.toFixed(2)}</div>
          <div className="cart-panel-actions">
            <button className="cart-panel-clear-btn" onClick={onClear}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </aside>
  );
};

export default CartPanel;