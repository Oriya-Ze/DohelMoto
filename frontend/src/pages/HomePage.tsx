import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  WrenchIcon, 
  CogIcon, 
  TruckIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: WrenchIcon,
      title: 'Expert Parts Selection',
      description: 'Get professional recommendations for tractor and off-road vehicle parts from our experienced team.',
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your farm or workshop within 2-3 business days.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Guarantee',
      description: 'All parts come with manufacturer warranty and our quality guarantee for peace of mind.',
    },
  ];

  const products = [
    {
      id: '1',
      name: 'Tractor Hydraulic Pump',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Heavy Duty Tractor Tires',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      rating: 4.6,
    },
    {
      id: '3',
      name: 'Tractor Engine Filter Set',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Polaris Style */}
      <section className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
                DOHELMOTO
              </h1>
              <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto font-light leading-relaxed"
            >
              Premium tractor and off-road vehicle parts engineered for extreme performance
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/shop"
                className="bg-white text-black px-12 py-4 rounded-none font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                EXPLORE PARTS
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-12 py-4 rounded-none font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300"
              >
                JOIN DOHELMOTO
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section - Polaris Style */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-black mb-8 tracking-tight"
            >
              ENGINEERED FOR EXTREME
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto font-light"
            >
              Premium tractor and off-road vehicle parts designed for the most demanding conditions
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-6 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Polaris Style */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-8 tracking-tight"
            >
              PREMIUM PARTS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto font-light"
            >
              Engineered for extreme performance and durability
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group bg-gray-900 rounded-none overflow-hidden hover:bg-gray-800 transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-12 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-4 tracking-wide">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-6">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-300">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-white">
                      ${product.price}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="bg-white text-black px-6 py-3 rounded-none font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                    >
                      VIEW DETAILS
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/shop"
              className="bg-white text-black px-12 py-4 rounded-none font-semibold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            >
              EXPLORE ALL PARTS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;