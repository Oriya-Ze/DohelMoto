import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import ProductCard from '../products/ProductCard.tsx';

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link
          to="/shop"
          className="btn-primary btn-lg px-8 inline-flex items-center group"
        >
          View All Products
          <svg
            className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
};

export default FeaturedProducts;

