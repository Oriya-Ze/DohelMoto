import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">E-Shop</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted online shopping destination with AI-powered recommendations 
              and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Youtube className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Special Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/best-sellers"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/size-guide"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white text-sm">support@eshop.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white text-sm">
                    123 Commerce St<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} E-Shop. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/cookies"
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Powered by AI</span>
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

