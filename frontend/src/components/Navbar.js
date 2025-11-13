import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import useCartStore from '../store/cartStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { getCartCount } = useCartStore();
  const cartCount = getCartCount();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🍜</span>
            </div>
            <span className="font-bold text-xl text-dark dark:text-white hidden sm:inline">
              QuickBite
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-dark dark:text-gray-300 hover:text-primary-500 transition">
              Home
            </Link>
            <Link to="/menu" className="text-dark dark:text-gray-300 hover:text-primary-500 transition">
              Menu
            </Link>
            <Link to="/about" className="text-dark dark:text-gray-300 hover:text-primary-500 transition">
              About
            </Link>
            <Link to="/contact" className="text-dark dark:text-gray-300 hover:text-primary-500 transition">
              Contact
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/orders" className="relative">
              <FiShoppingCart className="text-2xl text-dark dark:text-white hover:text-primary-500 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark transition"
            >
              {theme === 'light' ? (
                <FiMoon className="text-xl text-dark" />
              ) : (
                <FiSun className="text-xl text-white" />
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-primary-100 dark:hover:bg-secondary-900 transition">
                  <FiUser className="text-dark dark:text-white" />
                  <span className="text-sm font-medium text-dark dark:text-white hidden sm:inline">
                    {user?.name || 'Profile'}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      logout();
                    }
                  }}
                  className="p-2 text-dark dark:text-white hover:text-red-500 transition rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Logout"
                >
                  <FiLogOut className="text-xl" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-primary-500 hover:text-primary-600 font-semibold transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-2xl text-dark dark:text-white"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-900 rounded transition">
              Home
            </Link>
            <Link to="/menu" className="block px-4 py-2 text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-900 rounded transition">
              Menu
            </Link>
            <Link to="/about" className="block px-4 py-2 text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-900 rounded transition">
              About
            </Link>
            <Link to="/contact" className="block px-4 py-2 text-dark dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-secondary-900 rounded transition">
              Contact
            </Link>
            {!isAuthenticated && (
              <div className="px-4 py-2 space-y-2">
                <Link to="/login" className="block text-center btn-primary">
                  Login
                </Link>
                <Link to="/signup" className="block text-center btn-secondary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
