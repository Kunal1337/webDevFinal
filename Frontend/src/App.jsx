import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import CartPage from "./pages/Cart.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

import { CartProvider } from "./context/CartContext.jsx";
import "./App.css";

function AppContent() {
  const { state, signIn, signOut } = useAuthContext();

  // Debug logging
  useEffect(() => {
    console.log("Auth State:", state);
    console.log("Is Authenticated:", state.isAuthenticated);
    console.log("Is Loading:", state.isLoading);
  }, [state]);

  // Show loading while auth is initializing
  if (state.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading authentication...
      </div>
    );
  }

  const handleSignIn = async () => {
    try {
      console.log("Initiating sign in...");
      await signIn();
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Failed to sign in: " + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Initiating sign out...");
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out: " + error.message);
    }
  };

  return (
    <Router>
      {/* Simple floating auth indicator */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '8px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {state.isAuthenticated ? (
          <>
            <span style={{ fontSize: '14px', color: '#333' }}>
              {state.username || state.email || 'User'}
            </span>
            <button 
              onClick={handleSignOut}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={handleSignIn}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Login
          </button>
        )}
      </div>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}