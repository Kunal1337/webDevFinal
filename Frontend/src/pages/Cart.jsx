import React from 'react';
import CartPanel from '../components/CartPanel';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeItem, clearCart } = useCart();

  return (
    <div className="cart-page page-container">
      <h1>Your Cart</h1>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <CartPanel cart={cart} onRemove={removeItem} onClear={clearCart} />
      </div>
    </div>
  );
};

export default Cart;
