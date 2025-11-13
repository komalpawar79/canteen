import React from 'react';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, calculateTotal, totalPrice } = useCartStore();

  React.useEffect(() => {
    calculateTotal();
  }, [cart]);

  const tax = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + tax;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: isOpen ? 0 : 400 }}
        className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-premium z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-dark dark:text-white">Your Cart</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark dark:hover:text-white">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-dark dark:text-white">{item.name}</h4>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                      className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  <span className="font-bold text-primary-500">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-dark dark:text-white font-semibold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (5%)</span>
                <span className="text-dark dark:text-white font-semibold">₹{tax}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                <span className="font-bold text-dark dark:text-white">Total</span>
                <span className="font-bold text-primary-500 text-lg">₹{finalTotal}</span>
              </div>
            </div>
            <button className="w-full btn-primary">Proceed to Checkout</button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CartSidebar;
