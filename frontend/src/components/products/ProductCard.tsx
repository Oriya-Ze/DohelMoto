import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link
        to={`/product/${product.id}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-hover relative overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {product.image_urls.length > 0 ? (
              <img
                src={product.image_urls[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                -{discountPercentage}%
              </div>
            )}

            {/* Featured Badge */}
            {product.is_featured && (
              <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Featured
              </div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center space-x-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-colors"
                title="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`p-2 rounded-full shadow-lg transition-colors ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-900 hover:bg-red-500 hover:text-white'
                }`}
                title="Add to wishlist"
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-colors"
                title="Quick view"
              >
                <Eye className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            {product.category && (
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {product.category.name}
              </p>
            )}

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.review_count})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.discount_price || product.price)}
              </span>
              {product.discount_price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              {product.stock_quantity > 0 ? (
                <span className="text-xs text-green-600 font-medium">
                  In Stock ({product.stock_quantity} available)
                </span>
              ) : (
                <span className="text-xs text-red-600 font-medium">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

