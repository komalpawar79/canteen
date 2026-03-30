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
        className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-800 shadow-lg border-l border-green-200 dark:border-slate-700 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-green-200 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-green-50 to-white dark:from-slate-800 dark:to-slate-700">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-300">Your Cart</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition text-2xl">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-500 text-center">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="bg-green-50 dark:bg-slate-700 p-4 rounded-lg border border-green-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-slate-500 transition">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>
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
                      className="p-1 bg-green-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-green-300 dark:hover:bg-slate-500 transition"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold text-slate-700 dark:text-slate-300">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="p-1 bg-green-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-green-300 dark:hover:bg-slate-500 transition"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                  <span className="font-bold text-green-600">₹{item.price * item.quantity}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-green-200 dark:border-slate-700 p-6 space-y-4 bg-green-50 dark:bg-slate-700/50">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                <span className="text-slate-900 dark:text-white font-semibold">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Tax (5%)</span>
                <span className="text-slate-900 dark:text-white font-semibold">₹{tax}</span>
              </div>
              <div className="pt-2 border-t border-green-200 dark:border-slate-600 flex justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Total</span>
                <span className="font-bold text-green-600 text-lg">₹{finalTotal}</span>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md">Proceed to Checkout</button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CartSidebar;
