import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@asgardeo/auth-react';
import { Link } from 'react-router-dom';

const API_BASE = 'https://webdevfinal-2.onrender.com';

const OrderHistory = () => {
  const { state } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      fetchOrders();
    }
  }, [state.isAuthenticated, state.isLoading]);

  const getAuthHeaders = () => {
    if (!state.isAuthenticated || !state.username) {
      return null;
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${state.username || state.email}`,
    };
  };

  const fetchOrders = async () => {
    const headers = getAuthHeaders();
    if (!headers) {
      setError('Please log in to view your orders');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/orders`, { headers });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Order History</h1>
          <p className="text-white">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Order History</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return (
      <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Order History</h1>
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Please log in to view your order history</p>
            <Link to="/shop" className="btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-brandNavy px-12 py-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet</p>
            <Link to="/shop" className="btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Order Header */}
                <div 
                  className="p-6 bg-gradient-to-r from-brandNavy to-blue-900 text-white cursor-pointer hover:opacity-90 transition"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Order #{order.id}</h3>
                      <p className="text-blue-200 text-sm">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-brandGold">{formatPrice(order.total)}</p>
                      <p className="text-sm text-blue-200 mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <div className="space-x-6">
                      <span>Items: {order.items?.length || 0}</span>
                      <span>Subtotal: {formatPrice(order.subtotal)}</span>
                      <span>Tax: {formatPrice(order.tax)}</span>
                      <span>Shipping: {formatPrice(order.shipping)}</span>
                    </div>
                    <span className="text-brandGold">
                      {expandedOrder === order.id ? '▼ Hide Details' : '▶ View Details'}
                    </span>
                  </div>
                </div>

                {/* Order Details - Expandable */}
                {expandedOrder === order.id && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={`${item.brand} ${item.model}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                          
                          <div className="flex-grow">
                            <p className="font-semibold text-gray-800">
                              {item.brand} {item.model}
                            </p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            <p className="text-sm text-gray-600">Price: {formatPrice(item.price)}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-300">
                      <div className="space-y-2 text-right">
                        <div className="flex justify-end gap-4">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold w-24">{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-end gap-4">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-semibold w-24">{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-end gap-4">
                          <span className="text-gray-600">Shipping:</span>
                          <span className="font-semibold w-24">{formatPrice(order.shipping)}</span>
                        </div>
                        <div className="flex justify-end gap-4 pt-2 border-t border-gray-300">
                          <span className="text-lg font-bold">Total:</span>
                          <span className="text-lg font-bold text-brandGold w-24">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/shop" className="btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;