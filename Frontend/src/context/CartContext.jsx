import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try { 
      localStorage.setItem('cart', JSON.stringify(cart)); 
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [cart]);

  const addItem = (product) => {
    setCart(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx === -1) return [...prev, { ...product, quantity: 1 }];
      const next = prev.slice();
      next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
      return next;
    });
  };

  const increaseQty = (id) => {
    setCart(prev => prev.map(it => it.id === id ? { ...it, quantity: it.quantity + 1 } : it));
  };

  const decreaseQty = (id) => {
    setCart(prev => {
      return prev.reduce((acc, it) => {
        if (it.id === id) {
          const nextQty = it.quantity - 1;
          if (nextQty > 0) acc.push({ ...it, quantity: nextQty });
        } else {
          acc.push(it);
        }
        return acc;
      }, []);
    });
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, increaseQty, decreaseQty }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartContext;