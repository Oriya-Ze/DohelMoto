import React from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Star, Truck } from 'lucide-react';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '10K+',
      label: 'Happy Customers',
      description: 'Satisfied shoppers worldwide'
    },
    {
      icon: Package,
      value: '50K+',
      label: 'Products',
      description: 'Wide selection of quality items'
    },
    {
      icon: Star,
      value: '4.9',
      label: 'Average Rating',
      description: 'Based on customer reviews'
    },
    {
      icon: Truck,
      value: '24/7',
      label: 'Support',
      description: 'Always here to help you'
    }
  ];

  return (
    <section className="py-16 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Join our growing community of satisfied customers who trust us for their shopping needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5, type: "spring" }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                
                <h3 className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </h3>
                
                <p className="text-primary-100 text-sm">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

