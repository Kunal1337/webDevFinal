import React from 'react';
import CartPanel from '../components/CartPanel';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeItem, clearCart } = useCart();

  return (
    <div className="w-full bg-brandNavy px-12 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Your Cart</h1>
        <CartPanel cart={cart} onRemove={removeItem} onClear={clearCart} />
      </div>
    </div>
  );
};

export default Cart;
