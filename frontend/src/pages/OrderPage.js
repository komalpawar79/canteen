import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiArrowRight, FiTruck, FiHome, FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

const OrderPage = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart, calculateTotal, updateQuantity, removeFromCart } = useCartStore();
  const { user, token } = useAuthStore();
  const [orderMode, setOrderMode] = useState('dine-in');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [specialRequests, setSpecialRequests] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate total when component mounts or cart changes
  useEffect(() => {
    calculateTotal();
  }, [cart, calculateTotal]);

  const handleIncreaseQuantity = (itemId) => {
    const item = cart.find(i => i._id === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
      calculateTotal();
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cart.find(i => i._id === itemId);
    if (item && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
      calculateTotal();
    }
  };

  const tax = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + tax;

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    setShowSummary(true);
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      toast.error('Please login first!');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Validate cart
      if (cart.length === 0) {
        throw new Error('Cart is empty');
      }

      // Get canteen ID from first item
      const firstItem = cart[0];
      const canteenId = firstItem.canteenId || firstItem.canteen;

      if (!canteenId) {
        throw new Error('Canteen ID not found in cart');
      }

      // Prepare order items - validate ObjectId format
      const items = cart.map(item => {
        const itemId = item._id?.toString?.() || String(item._id);
        
        // Check if it's a valid MongoDB ObjectId (24 hex chars)
        if (!itemId || itemId.length === 0) {
          throw new Error(`Invalid item ID: "${itemId}"`);
        }
        
        // Validate ObjectId format (24 character hex string)
        if (!/^[0-9a-f]{24}$/i.test(itemId) && !/^\d+$/.test(itemId)) {
          console.warn(`Item ID "${itemId}" may not be valid MongoDB format, but sending anyway:`, item);
        }

        return {
          menuItem: itemId,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          specialInstructions: ''
        };
      });

      const orderData = {
        canteenId: String(canteenId),
        items: items,
        orderMode,
        totalAmount: parseFloat(totalPrice) || 0,
        tax: parseInt(tax) || 0,
        finalAmount: parseFloat(finalTotal) || 0,
        paymentMethod,
        specialRequests,
        estimatedTime: 30,
        status: 'pending',
        paymentStatus: 'pending'
      };

      console.log('Sending order data:', orderData);

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      toast.success('✅ Order placed successfully!');
      console.log('Order created:', data.order);
      clearCart();
      setShowSummary(false);
      
      // Redirect to order tracking
      setTimeout(() => {
        navigate(`/order-tracking/${data.order._id}`);
      }, 1000);
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-dark dark:text-white mb-8">Order Summary</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Mode */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
                <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">Select Delivery Mode</h2>
                <div className="space-y-3">
                  {[
                    { id: 'dine-in', label: 'Dine-In', icon: <FiHome className="text-2xl" /> },
                    { id: 'takeaway', label: 'Takeaway', icon: <FiShoppingCart className="text-2xl" /> },
                    { id: 'delivery', label: 'Campus Delivery', icon: <FiTruck className="text-2xl" /> },
                  ].map((mode) => (
                    <motion.button
                      key={mode.id}
                      onClick={() => setOrderMode(mode.id)}
                      className={`w-full p-4 rounded-lg flex items-center space-x-4 transition ${
                        orderMode === mode.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-dark dark:text-white hover:bg-primary-100 dark:hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {mode.icon}
                      <span className="font-semibold">{mode.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
                <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: '💳 Debit/Credit Card' },
                    { id: 'upi', label: '📱 UPI' },
                    { id: 'wallet', label: '👛 Digital Wallet' },
                    { id: 'cash', label: '💵 Cash on Delivery' },
                  ].map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-lg text-left font-semibold transition ${
                        paymentMethod === method.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-dark dark:text-white hover:bg-primary-100 dark:hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {method.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft">
                <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">Special Requests</h2>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Add any special instructions for your order..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                />
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-premium sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">Bill Summary</h3>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item._id} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="flex-1">
                          <span className="text-gray-600 dark:text-gray-300">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => handleDecreaseQuantity(item._id)}
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus size={12} />
                            </button>
                            <span className="font-semibold text-dark dark:text-white w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncreaseQuantity(item._id)}
                              className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                              <FiPlus size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-dark dark:text-white block">
                            ₹{item.price * item.quantity}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ₹{item.price} each
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-dark dark:text-white font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax (5%)</span>
                    <span className="text-dark dark:text-white font-semibold">₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-dark dark:text-white">Total</span>
                    <span className="text-primary-500">₹{finalTotal}</span>
                  </div>
                </div>

                <motion.button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 btn-primary py-3 font-bold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={cart.length === 0}
                >
                  <span>Place Order</span>
                  <FiArrowRight />
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Order Confirmation Modal */}
        {showSummary && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">Confirm Order?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Order Mode: <span className="font-bold capitalize text-dark dark:text-white">{orderMode}</span>
                <br />
                Payment: <span className="font-bold capitalize text-dark dark:text-white">{paymentMethod}</span>
                <br />
                Total: <span className="font-bold text-primary-500">₹{finalTotal}</span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSummary(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
