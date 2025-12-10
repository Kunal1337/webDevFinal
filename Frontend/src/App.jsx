import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Login from "./pages/Login";
import AdminPanel from './pages/AdminPanel';
import OrderHistory from './pages/OrderHistory';


import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import CartPage from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";

import FloatingChat from './components/FloatingChat';

import { CartProvider } from "./context/CartContext.jsx";
import "./App.css";

function AppContent() {
  const { state, signIn, signOut } = useAuthContext();

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

  return (
    <Router>
      <Navbar 
        isAuthenticated={state.isAuthenticated}
        username={state.username || state.email}
        onSignIn={signIn}
        onSignOut={signOut}
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      <Footer/> 
                    <FloatingChat />
      

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