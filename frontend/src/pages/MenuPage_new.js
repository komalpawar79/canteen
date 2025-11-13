import React, { useState, useEffect } from 'react';
import { FiFilter, FiSearch, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MenuCard from '../components/MenuCard';
import toast from 'react-hot-toast';

const MenuPage = () => {
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    dietary: '',
    priceRange: 'all',
    category: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [canteens, setCanteens] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch canteens
        const canteenRes = await fetch('http://localhost:5000/api/canteens');
        const canteenData = await canteenRes.json();
        if (canteenRes.ok && canteenData.canteens) {
          setCanteens(canteenData.canteens);
        } else {
          console.warn('Failed to fetch canteens:', canteenData);
          setCanteens([]);
        }

        // Fetch menu items
        const menuRes = await fetch('http://localhost:5000/api/menu');
        const menuData = await menuRes.json();
        if (menuRes.ok && menuData.items) {
          setMenuItems(menuData.items);
        } else {
          console.warn('Failed to fetch menu items:', menuData);
          setMenuItems([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load menu data');
        setCanteens([]);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sorting function
  const getSortedItems = (items) => {
    const sorted = [...items];
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  // Filter items
  const filteredItems = menuItems.filter((item) => {
    if (selectedCanteen && item.canteen !== selectedCanteen) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange === '300+' ? [300, Infinity] : filters.priceRange.split('-').map(Number);
      if (item.price < min || item.price > max) return false;
    }
    
    return true;
  });

  const sortedItems = getSortedItems(filteredItems);
  const uniqueCanteen = selectedCanteen ? canteens.find(c => c._id === selectedCanteen) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-black text-dark dark:text-white mb-4">🍔 Explore Menu</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {uniqueCanteen 
              ? `Order from ${uniqueCanteen.name}` 
              : `Browse and order from ${canteens.length} campus canteens`
            }
          </p>
        </motion.div>

        {/* Canteen Selection */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">Select Canteen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {canteens.length === 0 ? (
              <p className="text-gray-500">Loading canteens...</p>
            ) : (
              canteens.map((canteen) => (
                <motion.button
                  key={canteen._id}
                  onClick={() => setSelectedCanteen(canteen._id === selectedCanteen ? null : canteen._id)}
                  className={`p-4 rounded-lg text-left transition ${
                    selectedCanteen === canteen._id
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-dark dark:text-white hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className="font-bold">{canteen.name}</h3>
                  <p className="text-sm opacity-75">{canteen.location?.building || 'Campus'}</p>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="popular">⭐ Popular</option>
              <option value="price-low">💰 Price: Low to High</option>
              <option value="price-high">💸 Price: High to Low</option>
            </select>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                showFilters
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-dark dark:text-white'
              }`}
            >
              <FiFilter />
              <span>Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="font-bold text-dark dark:text-white mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Filter */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-white mb-2">💰 Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white"
                >
                  <option value="all">All Prices</option>
                  <option value="0-100">₹0 - ₹100</option>
                  <option value="100-200">₹100 - ₹200</option>
                  <option value="200-300">₹200 - ₹300</option>
                  <option value="300+">₹300+</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Menu Items Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading menu...</p>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 text-lg">No items found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                📍 {sortedItems.length} items available
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MenuPage;
