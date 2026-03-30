import React from 'react';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useCartStore from '../store/cartStore';

const MenuCard = ({ item, onViewDetails }) => {
  const { addToCart, selectedCanteen } = useCartStore();
  const [quantity, setQuantity] = React.useState(1);
  const [showQuantity, setShowQuantity] = React.useState(false);

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedCanteen || item.canteen);
    setQuantity(1);
    setShowQuantity(false);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-green-100 dark:border-slate-700 card-hover"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-slate-700 overflow-hidden">
        <img
          src={item.image || 'https://via.placeholder.com/300x200?text=Food+Image'}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {item.discount > 0 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
            {item.discount}% OFF
          </div>
        )}
        {item.dietary && (
          <div className={`absolute top-2 left-2 px-3 py-1 rounded-lg text-white font-semibold text-xs shadow-md ${
            item.dietary === 'veg' ? 'bg-green-500' : item.dietary === 'vegan' ? 'bg-green-600' : 'bg-red-500'
          }`}>
            {item.dietary.toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">{item.name}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">{item.description}</p>

        {/* Details */}
        <div className="flex justify-between items-center mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">{item.category}</span>
          <span>⏱️ {item.preparationTime || 30} min</span>
        </div>

        {/* Rating */}
        <div className="flex items-center mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={16}
                className={i < Math.floor(item.rating || 0) ? 'fill-current' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">({item.reviewCount || 0})</span>
        </div>

        {/* Price and Action */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
            {item.discount > 0 && (
              <span className="text-xs text-slate-400 line-through ml-2">
                ₹{Math.round(item.price / (1 - item.discount / 100))}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowQuantity(!showQuantity)}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition shadow-md"
          >
            <FiShoppingCart />
          </button>
        </div>

        {/* Quantity Selector */}
        {showQuantity && (
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 bg-green-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-green-200 dark:hover:bg-slate-600 transition"
            >
              -
            </button>
            <span className="flex-1 text-center font-semibold text-slate-700 dark:text-slate-300">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-2 py-1 bg-green-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-green-200 dark:hover:bg-slate-600 transition"
            >
              +
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 btn-primary text-sm"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MenuCard;
