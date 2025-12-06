import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://webdevfinal-ai.onrender.com/"; // change if needed


const CartContext = createContext({
  cart: [],
  loading: true,
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  increaseQty: () => {},
  decreaseQty: () => {},
  fetchCart: () => {}
});


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // LOAD CART FROM BACKEND ON PAGE LOAD
  // ---------------------------------------------------------
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/cart`);
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ---------------------------------------------------------
  // ADD ITEM TO CART
  // ---------------------------------------------------------
  const addItem = async (product) => {
    try {
      await axios.post(`${API_BASE}/api/cart`, {
        product_id: product.id,
      });
      fetchCart();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // ---------------------------------------------------------
  // INCREASE QUANTITY
  // ---------------------------------------------------------
  const increaseQty = async (cartItemId) => {
    try {
      await axios.put(`${API_BASE}/api/cart/increase/${cartItemId}`);
      fetchCart();
    } catch (err) {
      console.error("Error increasing qty:", err);
    }
  };

  // ---------------------------------------------------------
  // DECREASE QUANTITY (removes at 0)
  // ---------------------------------------------------------
  const decreaseQty = async (cartItemId) => {
    try {
      await axios.put(`${API_BASE}/api/cart/decrease/${cartItemId}`);
      fetchCart();
    } catch (err) {
      console.error("Error decreasing qty:", err);
    }
  };

  // ---------------------------------------------------------
  // REMOVE ITEM COMPLETELY
  // ---------------------------------------------------------
  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE}/api/cart/${cartItemId}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // ---------------------------------------------------------
  // CLEAR CART
  // ---------------------------------------------------------
  const clearCart = async () => {
    try {
      await axios.delete(`${API_BASE}/api/cart`);
      fetchCart();
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        removeItem,
        clearCart,
        increaseQty,
        decreaseQty,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

export default CartContext;
