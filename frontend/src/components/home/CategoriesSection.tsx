import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../../lib/api.ts';
import LoadingSpinner from '../common/LoadingSpinner.tsx';

const CategoriesSection: React.FC = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsAPI.getCategories(),
    select: (response) => response.data,
  });

  const categoryIcons = {
    'Electronics': '📱',
    'Clothing': '👕',
    'Home & Garden': '🏠',
    'Sports': '⚽',
    'Books': '📚',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!categories?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          className="group"
        >
          <Link
            to={`/shop?category=${category.id}`}
            className="block"
          >
            <div className="bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 p-6 text-center group-hover:bg-primary-50">
              {/* Category Icon */}
              <div className="text-4xl mb-4">
                {categoryIcons[category.name as keyof typeof categoryIcons] || '📦'}
              </div>
              
              {/* Category Name */}
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {category.name}
              </h3>
              
              {/* Category Description */}
              {category.description && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </p>
              )}
              
              {/* Arrow Icon */}
              <div className="mt-4 flex justify-center">
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all"
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
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoriesSection;

