import React from 'react';

const CartPanel = ({ cart, onRemove, onClear }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className="cart-panel">
      <h3>Your Cart</h3>
      {cart.length === 0 ? (
        <p className="empty">Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="meta">
                  <div className="name">{item.name}</div>
                  <div className="qty">Qty: {item.quantity}</div>
                </div>
                <div className="price">${(item.price * item.quantity).toFixed(2)}</div>
                <button className="btn-small remove" onClick={() => onRemove(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-total">Total: ${total.toFixed(2)}</div>
          <div className="cart-actions">
            <button className="btn" onClick={onClear}>Clear Cart</button>
          </div>
        </>
      )}
    </aside>
  );
};

export default CartPanel;
