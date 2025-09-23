import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail('');
      toast.success('Thank you for subscribing to our newsletter!');
    }, 1000);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6"
          >
            <Mail className="h-8 w-8 text-white" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive deals, and special offers.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10 w-full text-gray-900"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg px-6 whitespace-nowrap"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner h-4 w-4 mr-2"></div>
                    Subscribing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </div>
                )}
              </button>
            </div>
          </form>

          <p className="text-sm text-primary-200 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;

