import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  LogOut,
  Package,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useCart } from '../contexts/CartContext.tsx';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center"
            >
              <ShoppingBag className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900">E-Shop</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
                placeholder="Search products..."
              />
            </div>
          </form>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/shop"
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Shop
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Categories
            </Link>
            <Link
              to="/deals"
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Deals
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600">
              <Search className="h-5 w-5" />
            </button>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-gray-200 py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.full_name || user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Package className="h-4 w-4 mr-3" />
                        Orders
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="btn-ghost btn-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 w-full"
                    placeholder="Search products..."
                  />
                </div>
              </form>
              
              {/* Mobile Navigation */}
              <nav className="mt-4 space-y-2">
                <Link
                  to="/shop"
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/categories"
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  to="/deals"
                  className="block py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deals
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

