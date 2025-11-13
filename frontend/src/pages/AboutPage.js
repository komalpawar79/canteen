import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiTrendingUp, FiHeart, FiMapPin, FiClock } from 'react-icons/fi';
import LearnMoreModal from '../components/LearnMoreModal';

const AboutPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('story');
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Scroll animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Campus statistics
  const stats = [
    { icon: FiUsers, value: '10K+', label: 'Daily Users' },
    { icon: FiMapPin, value: '4', label: 'Canteens' },
    { icon: FiTrendingUp, value: '2K+', label: 'Menu Items' },
    { icon: FiClock, value: '30 min', label: 'Avg Delivery' },
  ];

  // Team members
  const teamMembers = [
    {
      name: 'Raj Patil',
      role: 'Founder & CEO',
      emoji: '👨‍💼',
      specialty: 'Campus Solutions',
    },
    {
      name: 'Saniya More',
      role: 'Operations Head',
      emoji: '👩‍💼',
      specialty: 'Food Quality',
    },
    {
      name: 'komal Pawar',
      role: 'Tech Lead',
      emoji: '👨‍💻',
      specialty: 'Innovation',
    },
    {
      name: 'Naushad Rahi',
      role: 'Customer Care',
      emoji: '👩‍💼',
      specialty: 'Student Support',
    },
    {
      name: 'Rushikesh Deshmukh',
      role: 'UI/UX Designer',
      emoji: '👩‍💼',
      specialty: 'Student Support', 
    }
  ];

  // Why QuickBite
  const reasons = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: '30-minute guaranteed delivery or your order is FREE!',
    },
    {
      icon: '🔒',
      title: 'Safe & Hygienic',
      description: 'All canteens follow strict hygiene standards daily',
    },
    {
      icon: '💰',
      title: 'Budget Friendly',
      description: 'Special discounts for students, faculty, and groups',
    },
    {
      icon: '📱',
      title: 'Easy Ordering',
      description: 'Simple app interface, just 3 clicks to order',
    },
    {
      icon: '🌱',
      title: 'Healthy Options',
      description: 'Veg, non-veg, vegan, and special diet options',
    },
    {
      icon: '⭐',
      title: 'Quality Guaranteed',
      description: 'Ratings & reviews from 10K+ verified students',
    },
  ];

  // Campus zones
  const campusZones = [
    {
      zone: 'Central Campus',
      canteen: '🏢 Main Canteen',
      dishes: 'All-day breakfast to dinner',
      image: '🏫',
      color: 'from-blue-500 to-blue-600',
    },
    {
      zone: 'Near Hostels',
      canteen: '🍽️ Food Court',
      dishes: 'Popular favorites & combos',
      image: '🏘️',
      color: 'from-purple-500 to-purple-600',
    },
    {
      zone: 'Library Building',
      canteen: '⚡ Quick Bites',
      dishes: 'Fast snacks & beverages',
      image: '📚',
      color: 'from-amber-500 to-amber-600',
    },
    {
      zone: 'Student Center',
      canteen: '☕ Cafe Coffee',
      dishes: 'Coffee, shakes & pastries',
      image: '🎓',
      color: 'from-green-500 to-green-600',
    },
  ];

  // Journey timeline
  const timeline = [
    { year: '2024', event: '🚀 QuickBite Launched', description: 'Started with vision to revolutionize campus food' },
    { year: '2024', event: '🎉 1,000 Orders', description: 'Reached first 1,000 successful deliveries' },
    { year: '2024', event: '⭐ 4.6+ Rating', description: 'Maintained excellent quality standards' },
    { year: '2025', event: '🌟 Growing Strong', description: 'Expanding reach with more features' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-dark">
      {/* Hero Section with Parallax */}
      <motion.section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-900 via-dark to-secondary-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* First Food Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200")',
              backgroundAttachment: 'fixed',
            }}
          />
          
          {/* Second Food Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200")',
              backgroundAttachment: 'fixed',
              backgroundPosition: 'right',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-dark/80" />
          
          {/* Animated Particles */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-8 right-10 w-72 h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Welcome to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-200 to-secondary-300 animate-pulse">
              QuickBite 🎉
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-gray-100 font-semibold mb-10 drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your Campus Food Companion - Fast, Fresh & Friendly
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/menu')}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              🍔 Order Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLearnMore(true)}
              className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white rounded-full font-bold text-lg transition-all"
            >
              📖 Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 px-4 max-w-7xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={staggerItem}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-soft hover:shadow-lg transition"
                whileHover={{ y: -5 }}
              >
                <Icon className="text-4xl text-primary-500 mx-auto mb-3" />
                <div className="text-3xl font-black text-dark dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Tabs Section */}
      <motion.section
        className="py-16 px-4 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {['story', 'why', 'campus', 'team'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-xl font-bold capitalize transition ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'story' && '📖'} {tab === 'why' && '⭐'} {tab === 'campus' && '🏫'} {tab === 'team' && '👥'} {tab}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="space-y-8">
              <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
              >
                <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">📖 Our Story</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  QuickBite was born from a simple observation: students are hungry, busy, and deserve better food options on campus!
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  We started with a vision to transform the way students eat on campus. No more waiting in long queues, no more expensive delivery fees, no more compromising on quality.
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Today, QuickBite serves 10,000+ students daily with 4 canteens, 2,000+ dishes, and lightning-fast delivery. We're not just a food app - we're part of the campus lifestyle! 🎓
                </p>
              </motion.div>

              {/* Timeline */}
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 items-start bg-white dark:bg-gray-800 p-6 rounded-xl shadow-soft"
                  >
                    <div className="text-3xl font-bold text-primary-500 min-w-fit">{item.year}</div>
                    <div>
                      <h3 className="text-xl font-bold text-dark dark:text-white">{item.event}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Why Tab */}
          {activeTab === 'why' && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-soft hover:shadow-lg transition"
                >
                  <div className="text-5xl mb-4">{reason.icon}</div>
                  <h3 className="text-xl font-bold text-dark dark:text-white mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {reason.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Campus Tab */}
          {activeTab === 'campus' && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {campusZones.map((zone, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -5 }}
                  className={`bg-gradient-to-br ${zone.color} text-white p-8 rounded-2xl shadow-lg overflow-hidden relative group`}
                >
                  {/* Background Animation */}
                  <div className="absolute inset-0 opacity-10 text-8xl flex items-center justify-center pointer-events-none">
                    {zone.image}
                  </div>

                  <div className="relative z-10">
                    <div className="text-5xl mb-3">{zone.image}</div>
                    <h3 className="text-2xl font-bold mb-2">{zone.zone}</h3>
                    <p className="text-lg font-semibold mb-2">{zone.canteen}</p>
                    <p className="text-sm opacity-90">{zone.dishes}</p>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                    whileHover={{ opacity: 1 }}
                  >
                    <button className="bg-white text-dark px-6 py-2 rounded-lg font-bold">
                      Visit →
                    </button>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8, rotateY: 5 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft hover:shadow-lg text-center transition"
                >
                  <div className="text-6xl mb-4">{member.emoji}</div>
                  <h3 className="text-xl font-bold text-dark dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-500 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.specialty}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 opacity-10 text-9xl flex items-center justify-around pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          <span>🍜</span>
          <span>🍕</span>
          <span>🥗</span>
        </motion.div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Order Your Favorite Meal? 🤤
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ happy students and get fresh food delivered in 30 minutes!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/menu')}
            className="px-10 py-4 bg-white text-primary-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transition"
          >
            🍔 Start Ordering Now
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Footer Info */}
      <motion.section
        className="py-12 px-4 bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-2">📱</div>
            <h3 className="font-bold text-dark dark:text-white mb-1">Easy App</h3>
            <p className="text-gray-600 dark:text-gray-400">Download QuickBite app for easy ordering</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🚚</div>
            <h3 className="font-bold text-dark dark:text-white mb-1">Fast Delivery</h3>
            <p className="text-gray-600 dark:text-gray-400">Average 30 mins from order to your door</p>
          </div>
          <div>
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="font-bold text-dark dark:text-white mb-1">Quality Assured</h3>
            <p className="text-gray-600 dark:text-gray-400">Rated 4.6+ by 10K+ verified students</p>
          </div>
        </div>
      </motion.section>

      {/* LearnMoreModal Component */}
      <LearnMoreModal isOpen={showLearnMore} onClose={() => setShowLearnMore(false)} />
    </div>
  );
};

export default AboutPage;
