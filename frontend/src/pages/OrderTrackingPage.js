import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiTruck } from 'react-icons/fi';

const OrderTrackingPage = () => {
  const [order] = useState({
    orderId: 'ORD123456',
    status: 'preparing',
    estimatedTime: '25 minutes',
    items: ['Butter Chicken', 'Naan', 'Coke'],
    total: '₹380',
    location: 'Main Canteen',
    deliveryAddress: 'Hostel B, Room 204',
  });

  const statuses = [
    { step: 'Confirmed', icon: '✓', completed: true },
    { step: 'Preparing', icon: '👨‍🍳', completed: true, current: true },
    { step: 'Ready', icon: '📦', completed: false },
    { step: 'On the way', icon: '🚗', completed: false },
    { step: 'Delivered', icon: '🎉', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50   py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-dark  mb-2">Order Tracking</h1>
            <p className="text-lg text-gray-600 ">Order ID: {order.orderId}</p>
          </div>

          {/* Status Timeline */}
          <motion.div
            className="bg-white  rounded-lg shadow-premium p-8 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-dark  mb-8">Order Status</h2>

            <div className="space-y-6">
              {statuses.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Step Circle */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl transition ${
                      item.completed || item.current
                        ? 'bg-gradient-to-br from-primary-500 to-accent text-white'
                        : 'bg-gray-200  text-gray-400'
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold transition ${
                        item.completed || item.current
                          ? 'text-dark '
                          : 'text-gray-400 '
                      }`}
                    >
                      {item.step}
                    </h3>
                    {item.current && (
                      <p className="text-primary-500 font-semibold mt-1">Currently happening...</p>
                    )}
                    {item.completed && !item.current && (
                      <p className="text-gray-600  text-sm mt-1">Completed</p>
                    )}
                  </div>

                  {/* Connector Line */}
                  {index < statuses.length - 1 && (
                    <div
                      className={`absolute left-7 w-1 h-12 transition ${
                        statuses[index + 1].completed
                          ? 'bg-gradient-to-b from-primary-500 to-primary-300'
                          : 'bg-gray-300 '
                      }`}
                      style={{ top: `${(index + 1) * 100 + 50}px` }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Estimated Time */}
            <div className="bg-white  rounded-lg shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100  rounded-full flex items-center justify-center text-2xl">
                  <FiClock />
                </div>
                <div>
                  <p className="text-gray-600  text-sm font-semibold">Estimated Delivery</p>
                  <p className="text-2xl font-bold text-dark ">{order.estimatedTime}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white  rounded-lg shadow-soft p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100  rounded-full flex items-center justify-center text-2xl">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-gray-600  text-sm font-semibold">Current Location</p>
                  <p className="text-2xl font-bold text-dark ">{order.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Items Summary */}
          <motion.div
            className="bg-white  rounded-lg shadow-soft p-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-dark  mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 ">
                  <span className="text-dark  font-medium">{item}</span>
                  <span className="text-gray-600 ">x1</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200  flex justify-between items-center">
              <span className="text-lg font-bold text-dark ">Total</span>
              <span className="text-2xl font-bold text-primary-500">{order.total}</span>
            </div>
          </motion.div>

          {/* Delivery Address */}
          <motion.div
            className="bg-blue-50  border border-blue-200  rounded-lg p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex gap-4">
              <FiTruck className="text-2xl text-blue-600  flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-blue-900  mb-1">Delivery Address</p>
                <p className="text-blue-800 ">{order.deliveryAddress}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
