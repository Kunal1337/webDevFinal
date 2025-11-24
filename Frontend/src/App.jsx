import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import ProductDetails from "./pages/ProductDetails";
import Cart from './pages/Cart.jsx'; 

import './App.css';
import { CartProvider } from './context/CartContext';
function App() {
  return (
    <CartProvider>
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product/:id" element={<ProductDetails />} />

      </Routes>
      <Footer />
    </Router>
    </CartProvider>
);
}
export default App;
