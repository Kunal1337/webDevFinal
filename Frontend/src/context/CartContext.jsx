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

      // Get the response with cartItemId
      const data = await response.json();

      // Update local state with cartItemId
      setCart(prev => {
        const idx = prev.findIndex(p => p.id === product.id);
        if (idx === -1) {
          // New item - add with cartItemId from response
          return [...prev, {
            ...product,
            cartItemId: data.id, // The cart item ID from backend
            quantity: 1
          }];
        }
        // Item already exists - just increment quantity
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
      // Get current cart item before updating state
      setCart(prev => {
        const cartItem = prev.find(item => item.id === id);
        if (!cartItem || !cartItem.cartItemId) {
          console.warn('Cannot increase qty - no cartItemId found for item:', id);
          return prev;
        }

        // Make API call in background
        fetch(`${API_BASE}/api/cart/increase/${cartItem.cartItemId}`, {
          method: 'PUT',
        }).catch(err => console.error('Error increasing quantity on backend:', err));

        // Update UI immediately
        return prev.map(it => 
          it.id === id ? { ...it, quantity: it.quantity + 1 } : it
        );
      });
    } catch (err) {
      console.error('Error in increaseQty:', err);
    }
  };

  const decreaseQty = async (id) => {
    try {
      // Get current cart item before updating state
      setCart(prev => {
        const cartItem = prev.find(item => item.id === id);
        if (!cartItem || !cartItem.cartItemId) {
          console.warn('Cannot decrease qty - no cartItemId found for item:', id);
          return prev;
        }

        // Make API call in background
        fetch(`${API_BASE}/api/cart/decrease/${cartItem.cartItemId}`, {
          method: 'PUT',
        }).catch(err => console.error('Error decreasing quantity on backend:', err));

        // Update UI immediately, removing if quantity would be 0 or less
        return prev
          .map(it => it.id === id ? { ...it, quantity: it.quantity - 1 } : it)
          .filter(it => it.quantity > 0);
      });
    } catch (err) {
      console.error('Error in decreaseQty:', err);
    }
  };

  const removeItem = async (id) => {
    try {
      // Find cartItemId first before removing
      const cartItem = cart.find(item => item.id === id);
      const cartItemId = cartItem?.cartItemId;

      // Remove from state immediately
      setCart(prev => prev.filter(i => i.id !== id));

      // Then make API call
      if (cartItemId) {
        await fetch(`${API_BASE}/api/cart/${cartItemId}`, {
          method: 'DELETE',
        }).catch(err => console.error('Error removing item:', err));
      }
    } catch (err) {
      console.error('Error in removeItem:', err);
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
