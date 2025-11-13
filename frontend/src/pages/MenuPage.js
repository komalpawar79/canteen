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
        }

        // Fetch menu items
        const menuRes = await fetch('http://localhost:5000/api/menu');
        const menuData = await menuRes.json();
        if (menuRes.ok && menuData.items) {
          setMenuItems(menuData.items);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if API fails
        setCanteens(mockCanteens);
        setMenuItems(mockMenuItems);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data - 4 Campus Canteens (fallback)
  const mockCanteens = [
    { _id: '1', name: 'Main Canteen', location: 'Central Campus', image: '🏢', rating: 4.6, itemCount: 45 },
    { _id: '2', name: 'Food Court', location: 'Near Hostels', image: '🍽️', rating: 4.5, itemCount: 38 },
    { _id: '3', name: 'Quick Bites', location: 'Library Building', image: '⚡', rating: 4.7, itemCount: 32 },
    { _id: '4', name: 'Cafe Coffee', location: 'Student Center', image: '☕', rating: 4.4, itemCount: 25 },
  ];

  // Mock menu items (fallback - with proper ObjectIds)
  const mockMenuItems = [
    {
      _id: '507f1f77bcf86cd799439001',
      name: 'Masala Dosa',
      description: 'Crispy rice crepe filled with spiced potato and served with sambar',
      price: 120,
      image: 'https://via.placeholder.com/300x200?text=Dosa',
      category: 'breakfast',
      dietary: 'veg',
      rating: 4.5,
      reviewCount: 145,
      preparationTime: 20,
      discount: 10,
      canteen: '1',
      isNew: false,
    },
    {
      _id: '507f1f77bcf86cd799439002',
      name: 'Idli Sambar',
      description: 'Fluffy steamed rice cakes with lentil stew',
      price: 80,
      image: 'https://via.placeholder.com/300x200?text=Idli',
      category: 'breakfast',
      dietary: 'veg',
      rating: 4.3,
      reviewCount: 98,
      preparationTime: 15,
      discount: 0,
      canteen: '2',
      isNew: true,
    },
  ];

  // Special Offers for Students & Faculty
  const specialOffers = [
    {
      id: 1,
      title: '🎓 Student Combo Pack',
      description: 'Any 2 items + 1 beverage at 20% discount',
      discount: 20,
      validFor: 'Students with ID',
      icon: '🎓',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      title: '👨‍🏫 Faculty Special',
      description: 'Daily lunch buffet at flat ₹99',
      discount: 'Flat ₹99',
      validFor: 'Faculty & Staff',
      icon: '👨‍🏫',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 3,
      title: '⏰ Breakfast Boost',
      description: 'Any breakfast item + coffee at 15% off',
      discount: 15,
      validFor: 'All Students',
      icon: '⏰',
      color: 'from-amber-500 to-amber-600',
    },
    {
      id: 4,
      title: '🤝 Group Order Discount',
      description: 'Order for 5+ people and get 25% off',
      discount: 25,
      validFor: 'Groups & Clubs',
      icon: '�',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 5,
      title: '🌙 Evening Special',
      description: 'After 4 PM: Snacks + beverage combo ₹80',
      discount: 'Only ₹80',
      validFor: 'Till 7 PM',
      icon: '🌙',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 6,
      title: '🎉 Weekend Treat',
      description: 'Saturdays & Sundays: Buy 2 get 1 free on selected items',
      discount: '50%',
      validFor: 'Weekends Only',
      icon: '🎉',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  // Sorting function
  const getSortedItems = (items) => {
    const sorted = [...items];
    switch (sortBy) {
      case 'popular':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.filter(item => item.isNew).concat(sorted.filter(item => !item.isNew));
      default:
        return sorted;
    }
  };

  const filteredItems = menuItems.filter((item) => {
    if (selectedCanteen && item.canteen !== selectedCanteen) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.dietary && item.dietary !== filters.dietary) return false;
    if (filters.category && item.category !== filters.category) return false;
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange === '300+' ? [300, Infinity] : filters.priceRange.split('-').map(Number);
      if (item.price < min || item.price > max) return false;
    }
    
    return true;
  });

  const sortedItems = getSortedItems(filteredItems);
  const uniqueCanteen = selectedCanteen ? canteens.find(c => c.id === selectedCanteen) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl font-black text-dark dark:text-white mb-2">🍔 Explore Menu</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {uniqueCanteen 
                  ? `Order from ${uniqueCanteen.name}` 
                  : `Browse and order from ${canteens.length} campus canteens`
                }
              </p>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                📍 {sortedItems.length} Items Available
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🎉 Special Offers Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-dark dark:text-white">🎁 Special Offers</h2>
            <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">LIMITED TIME</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${offer.color} text-white shadow-lg cursor-pointer hover:shadow-2xl transition group`}
              >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 opacity-10 text-6xl">
                  {offer.icon}
                </div>

                <div className="relative z-10">
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span>{offer.icon}</span>
                    <span>{offer.title}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-sm mb-4 opacity-90">
                    {offer.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-black">
                      {typeof offer.discount === 'number' ? `-${offer.discount}%` : offer.discount}
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-semibold">
                      {offer.validFor}
                    </span>
                  </div>

                  {/* CTA Button */}
                  <button className="mt-4 w-full bg-white text-dark font-bold py-2 rounded-lg opacity-0 group-hover:opacity-100 transition transform group-hover:scale-105">
                    Learn More →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Search Bar with Advanced Options */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search dishes, canteens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-dark dark:text-white focus:outline-none focus:border-primary-500 appearance-none cursor-pointer transition"
              >
                <option value="popular">⭐ Popular</option>
                <option value="newest">🆕 Newest</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💸 Price: High to Low</option>
              </select>
              <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                showFilters
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-dark dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <FiFilter />
              <span>Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-dark dark:text-white mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Dietary Filter */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-white mb-2">🥗 Dietary</label>
                <select
                  value={filters.dietary}
                  onChange={(e) => setFilters({ ...filters, dietary: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:border-primary-500 transition"
                >
                  <option value="">All Options</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-white mb-2">📂 Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:border-primary-500 transition"
                >
                  <option value="">All Items</option>
                  <option value="breakfast">☀️ Breakfast</option>
                  <option value="lunch">🍽️ Lunch</option>
                  <option value="snacks">🍿 Snacks</option>
                  <option value="beverages">☕ Beverages</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-dark dark:text-white mb-2">💵 Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-dark dark:text-white focus:border-primary-500 transition"
                >
                  <option value="all">All Prices</option>
                  <option value="0-100">₹0 - ₹100</option>
                  <option value="100-200">₹100 - ₹200</option>
                  <option value="200-300">₹200 - ₹300</option>
                  <option value="300+">₹300+</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ dietary: '', priceRange: 'all', category: '' });
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition font-semibold"
                >
                  🔄 Reset All
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Canteen Selection - Horizontal Scroll */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-dark dark:text-white mb-4">📍 Select Canteen</h3>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            <motion.button
              onClick={() => setSelectedCanteen(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl whitespace-nowrap font-semibold transition ${
                selectedCanteen === null
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-dark dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500'
              }`}
            >
              ✨ All Canteens
            </motion.button>
            {canteens.map((canteen) => (
              <motion.button
                key={canteen.id}
                onClick={() => setSelectedCanteen(canteen.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl whitespace-nowrap font-semibold transition flex items-center gap-2 ${
                  selectedCanteen === canteen.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-dark dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500'
                }`}
              >
                <span>{canteen.image}</span>
                <div className="text-left">
                  <div>{canteen.name}</div>
                  <div className="text-xs opacity-75">{canteen.itemCount} items • ⭐ {canteen.rating}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div
          className="mb-6 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
            {sortedItems.length === 0 ? (
              <span>❌ No items found</span>
            ) : (
              <span>✅ Showing {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </motion.div>

        {/* Menu Items Grid */}
        {sortedItems.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {sortedItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <MenuCard item={item} />
                
                {/* New Badge */}
                {item.isNew && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    🆕 NEW
                  </div>
                )}
                
                {/* Discount Badge */}
                {item.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    -{item.discount}%
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="col-span-full text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <motion.button
              onClick={() => {
                setSelectedCanteen(null);
                setSearchQuery('');
                setFilters({ dietary: '', priceRange: 'all', category: '' });
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold"
            >
              🔄 Clear Filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
