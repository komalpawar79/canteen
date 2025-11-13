import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import LearnMoreModal from '../components/LearnMoreModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [showLearnMore, setShowLearnMore] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-dark to-secondary-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Food images background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
              backgroundAttachment: 'fixed',
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-dark/80" />
          
          {/* Animated Particles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="mb-6 inline-block"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="bg-primary-500/20 border border-primary-300 text-primary-200 px-6 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              🎓 Your Campus Food Companion
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Fast Food,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-200 to-secondary-300 animate-pulse">
              Smart Choice!
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-2xl text-gray-100 font-semibold mb-10 max-w-3xl mx-auto drop-shadow-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Order delicious food from all campus canteens in <span className="text-primary-300 font-bold">just 3 taps</span>. Real-time tracking, easy payments, and meals delivered to your hostel or classroom.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {['⚡ 30-Min Delivery', '🔒 Secure Payment', '📍 Live Tracking', '⭐ Trusted Reviews'].map((feature, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm text-white font-semibold hover:bg-white/20 transition">
                {feature}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              to="/menu"
              className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-lg px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <span>🚀 Explore Menu</span>
              <FiArrowRight className="animate-bounce" />
            </Link>
            <button
              onClick={() => setShowLearnMore(true)}
              className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white text-lg px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105"
            >
              ℹ️ Learn More
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {[
              { number: '10K+', label: 'Students' },
              { number: '15+', label: 'Canteens' },
              { number: '2K+', label: 'Dishes' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 hover:bg-white/20 transition">
                <div className="text-2xl md:text-3xl font-bold text-primary-300">{stat.number}</div>
                <div className="text-sm text-gray-200 font-semibold mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-white text-4xl drop-shadow-lg">↓</div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-900 via-dark to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Why Students Love Us 💕</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Built specifically for campus life – fast, affordable, and designed to save your time during study hours.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={item} 
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 transform hover:scale-105"
              >
                <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 dark:bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-black text-dark dark:text-white mb-6">What Students Say 📢</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join 10K+ happy students who are already ordering from campus canteens.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Priya Singh',
                role: '2nd Year, CSE',
                text: 'Finally! A food app just for campus. Saves me 30 mins every day. Plus the discounts are insane! 🎉',
                avatar: '👩‍🎓',
                rating: 5,
              },
              {
                name: 'Arjun Patel',
                role: '3rd Year, Mech',
                text: 'The delivery is so fast I got my order while I was still selecting my menu item. Mind = blown 🤯',
                avatar: '👨‍🎓',
                rating: 5,
              },
              {
                name: 'Sneha Gupta',
                role: '1st Year, Science',
                text: 'Never miss studying sessions because of hunger again. Real-time tracking is amazing! ⏱️',
                avatar: '👩‍🎓',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={item}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-6">
                  <div className="text-5xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-lg font-bold text-dark dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-black text-dark dark:text-white mb-6">How It Works? 🚀</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get your favorite meal in just 3 simple steps
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { step: 1, title: 'Browse & Select', desc: 'Explore menus from all campus canteens', emoji: '🔍' },
              { step: 2, title: 'Quick Checkout', desc: 'Pay securely via UPI or Card', emoji: '💳' },
              { step: 3, title: 'Get Delivered', desc: 'Receive hot meals in 30 minutes', emoji: '🚚' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={item}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center shadow-soft hover:shadow-xl transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <FiArrowRight className="text-primary-500 text-3xl" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
    <LearnMoreModal isOpen={showLearnMore} onClose={() => setShowLearnMore(false)} />
    </>
  );
};

const features = [
  {
    icon: '�️',
    title: 'All Campus Canteens',
    description: 'Browse menus from 15+ canteens across campus. Every dining spot, one app.',
  },
  {
    icon: '⚡',
    title: '30-Min Delivery',
    description: 'Order during lectures, get food at hostel before study break. Lightning fast!',
  },
  {
    icon: '💰',
    title: 'Student Discounts',
    description: '20% off orders, free delivery, special cashback on your favorite meals.',
  },
  {
    icon: '�',
    title: 'Secure Payment',
    description: 'UPI, Cards, Wallet, or COD. Your payments are 100% safe and secure.',
  },
  {
    icon: '⭐',
    title: 'Real Reviews',
    description: 'Read genuine reviews from 10K+ students. See what\'s actually good.',
  },
  {
    icon: '📍',
    title: 'Live Tracking',
    description: 'See exactly where your order is. Real-time updates every 30 seconds.',
  },
  {
    icon: '🎁',
    title: 'Loyalty Rewards',
    description: 'Earn points on every order, redeem for free meals and exclusive perks.',
  },
  {
    icon: '🤝',
    title: 'Campus Support',
    description: '24/7 student support team. Issues resolved in minutes, not days.',
  },
];

export default LandingPage;
