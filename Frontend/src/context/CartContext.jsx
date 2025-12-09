import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';

const API_BASE = 'https://webdevfinal-2.onrender.com';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { state } = useAuthContext();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to get auth headers
  const getAuthHeaders = () => {
    if (!state.isAuthenticated || !state.username) {
      return null;
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.username || state.email}`,
    };
  };

  // Fetch cart when user logs in
  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      fetchCart();
    } else if (!state.isAuthenticated) {
      setCart([]);
    }
  }, [state.isAuthenticated, state.isLoading]);

  const fetchCart = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/cart`, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const data = await response.json();
      
      // Transform data to match expected format
      const transformedCart = data.map(item => ({
        id: item.product_id,
        name: `${item.brand} ${item.model}`,
        brand: item.brand,
        model: item.model,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image_url,
        image_url: item.image_url,
        description: item.description,
      }));
      
      setCart(transformedCart);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product) => {
    const headers = getAuthHeaders();
    if (!headers) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          product_id: product.id,
          quantity: 1 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to cart');
      }

      // Refresh cart after adding
      await fetchCart();
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(err.message || 'Failed to add item to cart');
      throw err;
    }
  };

  const removeItem = async (productId) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_BASE}/api/cart/${productId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      await fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item from cart');
    }
  };

  const increaseQty = async (productId) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_BASE}/api/cart/increase/${productId}`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to increase quantity');
      }

      await fetchCart();
    } catch (err) {
      console.error('Error increasing quantity:', err);
      alert('Failed to update quantity');
    }
  };

  const decreaseQty = async (productId) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_BASE}/api/cart/decrease/${productId}`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to decrease quantity');
      }

      await fetchCart();
    } catch (err) {
      console.error('Error decreasing quantity:', err);
      alert('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(`${API_BASE}/api/cart`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      setCart([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
      alert('Failed to clear cart');
    }
  };

  const value = {
    cart,
    loading,
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};