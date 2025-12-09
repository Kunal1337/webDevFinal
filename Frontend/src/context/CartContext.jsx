import React, { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = 'https://webdevfinal-2.onrender.com';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/cart`);
      if (response.ok) {
        const data = await response.json();
        // Transform backend cart items to frontend format
        const transformedCart = data.map(item => ({
          id: item.product_id || item.id,
          cartItemId: item.id, // The cart_items.id for API operations
          brand: item.brand,
          model: item.model,
          price: parseFloat(item.price),
          description: item.description,
          image_url: item.image_url,
          quantity: item.quantity || 1,
        }));
        setCart(transformedCart);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product) => {
    try {
      // Add to backend
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      // Update local state
      setCart(prev => {
        const idx = prev.findIndex(p => p.id === product.id);
        if (idx === -1) {
          return [...prev, { ...product, quantity: 1 }];
        }
        const next = prev.slice();
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  const increaseQty = async (id) => {
    try {
      // Find the cart item
      const cartItem = cart.find(item => item.id === id);
      if (!cartItem || !cartItem.cartItemId) {
        // If no cartItemId, try to add via product_id
        const response = await fetch(`${API_BASE}/api/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id: id }),
        });
        if (response.ok) {
          await fetchCart();
        }
        return;
      }

      const response = await fetch(`${API_BASE}/api/cart/increase/${cartItem.cartItemId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setCart(prev => prev.map(it => 
          it.id === id ? { ...it, quantity: it.quantity + 1 } : it
        ));
      }
    } catch (err) {
      console.error('Error increasing quantity:', err);
    }
  };

  const decreaseQty = async (id) => {
    try {
      const cartItem = cart.find(item => item.id === id);
      if (!cartItem || !cartItem.cartItemId) return;

      const response = await fetch(`${API_BASE}/api/cart/decrease/${cartItem.cartItemId}`, {
        method: 'PUT',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.quantity <= 0) {
          // Item was removed, refresh cart
          await fetchCart();
        } else {
          setCart(prev => prev.map(it => 
            it.id === id ? { ...it, quantity: it.quantity - 1 } : it
          ));
        }
      }
    } catch (err) {
      console.error('Error decreasing quantity:', err);
    }
  };

  const removeItem = async (id) => {
    try {
      const cartItem = cart.find(item => item.id === id);
      if (!cartItem || !cartItem.cartItemId) {
        // Fallback: just remove from local state
        setCart(prev => prev.filter(i => i.id !== id));
        return;
      }

      const response = await fetch(`${API_BASE}/api/cart/${cartItem.cartItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCart(prev => prev.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error('Error removing item:', err);
      // Still remove from local state on error
      setCart(prev => prev.filter(i => i.id !== id));
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCart([]);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      setCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItem, 
      removeItem, 
      clearCart, 
      increaseQty, 
      decreaseQty,
      loading,
      refreshCart: fetchCart,
    }}>
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
