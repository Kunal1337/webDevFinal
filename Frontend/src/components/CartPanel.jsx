import React from 'react';
import { useCart } from '../context/CartContext';

const CartPanel = ({ cart, onRemove, onClear }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { increaseQty, decreaseQty } = useCart();

  return (
    <aside className="bg-darkBg bg-opacity-30 p-4 rounded-lg text-white min-h-52">
      <h3 className="mb-3 font-bold">Your Cart</h3>
      {cart.length === 0 ? (
        <p className="text-gray-300">Your cart is empty</p>
      ) : (
        <>
          <ul className="list-none p-0 m-0 mb-3 flex flex-col gap-2">
            {cart.map(item => (
              <li key={item.id} className="flex gap-2 items-center">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-sm text-gray-300 flex items-center gap-2">
                    <button className="qty-btn" onClick={() => decreaseQty(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                </div>
                <div className="font-bold text-white mr-2">${(item.price * item.quantity).toFixed(2)}</div>
                <button className="btn-small remove" onClick={() => onRemove(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="font-bold mt-2 text-white">Total: ${total.toFixed(2)}</div>
          <div className="mt-3">
            <button className="btn w-full" onClick={onClear}>Clear Cart</button>
          </div>
        </>
      )}
    </aside>
  );
};

export default CartPanel;
