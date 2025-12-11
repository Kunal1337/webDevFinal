import { useAuthContext } from '@asgardeo/auth-react';


const API_BASE = 'https://webdevfinal-2.onrender.com';




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ADMIN_EMAIL = 'watchesauth372@gmail.com';
const TAX_RATE = 0.0825;
const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 25.00;

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useAuthContext();
  const { cart, clearCart } = useCart();
  
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  useEffect(() => {
    if (!state.isLoading) {
      if (!state.isAuthenticated) {
        alert('Please log in to checkout');
        navigate('/cart');
        return;
      }
      
      if (state.email === ADMIN_EMAIL) {
        alert('Admins cannot make purchases');
        navigate('/cart');
        return;
      }
      
      if (cart.length === 0) {
        alert('Your cart is empty');
        navigate('/cart');
        return;
      }
      
      fetchCards();
    }
  }, [state, cart, navigate]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/cards`, {
        headers: {
          'Authorization': `Bearer ${state.username || state.email}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCards(data);
        if (data.length > 0 && !selectedCardId) {
          setSelectedCardId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
  e.preventDefault();
  
  if (newCard.cardNumber.length < 16 || newCard.cardNumber.length > 19) {
    alert('Please enter a valid card number');
    return;
  }
  
  if (!newCard.cardholderName.trim()) {
    alert('Please enter cardholder name');
    return;
  }
  
  if (!newCard.expiryMonth || !newCard.expiryYear) {
    alert('Please enter expiry date');
    return;
  }
  
  if (newCard.cvv.length < 3 || newCard.cvv.length > 4) {
    alert('Please enter a valid CVV');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.username || state.email}`,
      },
      body: JSON.stringify({
        card_number: newCard.cardNumber.replace(/\s/g, ''),
        cardholder_name: newCard.cardholderName,
        expiry_month: parseInt(newCard.expiryMonth),
        expiry_year: parseInt(newCard.expiryYear),
        cvv: newCard.cvv,
      }),
    });

    if (response.ok) {  // ← FIXED: Changed from !response.ok
      const data = await response.json();
      setCards([...cards, data]);
      setSelectedCardId(data.id);
      setShowAddCardForm(false);
      setNewCard({
        cardNumber: '',
        cardholderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
      });
      alert('Card added successfully!');
    } else {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Add card error response:', response.status, errorData);
      alert(errorData.error || `Failed to add card (Status: ${response.status})`);
    }
  } catch (err) {
    console.error('Error adding card:', err);
    alert('Network error: Failed to add card');
  }
};

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const maskCardNumber = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length <= 4) return cleaned;
    return '**** **** **** ' + cleaned.slice(-4);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  const handleCheckout = async () => {
    if (!selectedCardId) {
      alert('Please select or add a payment card');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const confirmed = window.confirm(
      `Complete purchase for $${total.toFixed(2)}?\n\nThis will process your payment and clear your cart.`
    );

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      const response = await fetch(`${API_BASE}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.username || state.email}`,
        },
        body: JSON.stringify({
          card_id: selectedCardId,
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          tax,
          shipping,
          total,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Order placed successfully! Order ID: ${data.order_id || 'N/A'}`);
        clearCart();
        navigate('/');
      } else {
        const error = await response.json();
        alert(error.error || 'Checkout failed');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || state.isLoading) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!state.isAuthenticated || state.email === ADMIN_EMAIL || cart.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Method</h2>
              
              {cards.length > 0 && (
                <div className="space-y-3 mb-4">
                  {cards.map((card) => (
                    <label
                      key={card.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedCardId === card.id
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="card"
                        value={card.id}
                        checked={selectedCardId === card.id}
                        onChange={(e) => setSelectedCardId(parseInt(e.target.value))}
                        className="mr-3"
                      />
                      <div className="inline-block">
                        <div className="font-semibold text-gray-800">
                          {maskCardNumber(card.card_number)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {card.cardholder_name} • Expires {String(card.expiry_month).padStart(2, '0')}/{card.expiry_year}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {!showAddCardForm ? (
                <button
                  onClick={() => setShowAddCardForm(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition"
                >
                  + Add New Card
                </button>
              ) : (
                <form onSubmit={handleAddCard} className="space-y-4 p-4 border-2 border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={newCard.cardNumber}
                      onChange={(e) => setNewCard({ ...newCard, cardNumber: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={newCard.cardholderName}
                      onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                      <select
                        value={newCard.expiryMonth}
                        onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="">MM</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>
                            {String(month).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <select
                        value={newCard.expiryYear}
                        onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="">YYYY</option>
                        {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={newCard.cvv}
                        onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123"
                        maxLength="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
                    >
                      Add Card
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddCardForm(false);
                        setNewCard({ cardNumber: '', cardholderName: '', expiryMonth: '', expiryYear: '', cvv: '' });
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => {
                  const itemName = item.name || `${item.brand} ${item.model}`;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{itemName} × {item.quantity}</span>
                      <span className="text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8.25%)</span>
                  <span className="text-gray-800">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping {subtotal >= FREE_SHIPPING_THRESHOLD && <span className="text-green-600 ml-1">(Free!)</span>}
                  </span>
                  <span className="text-gray-800">
                    {shipping === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!selectedCardId || isProcessing}
                className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition ${
                  !selectedCardId || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'
                }`}
              >
                {isProcessing ? 'Processing...' : `Complete Purchase ($${total.toFixed(2)})`}
              </button>

              {!selectedCardId && (
                <p className="text-red-500 text-sm mt-2 text-center">Please select or add a payment card</p>
              )}

              <button onClick={() => navigate('/cart')} className="w-full mt-3 py-2 text-gray-600 hover:text-gray-800">
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const YourComponent = () => {
  const { state } = useAuthContext();
  
  // Add this useEffect to log auth state
  useEffect(() => {
  }, [state]);

  // rest of your component...
}



export default Checkout;