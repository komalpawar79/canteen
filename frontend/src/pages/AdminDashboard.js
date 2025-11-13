import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiUsers, FiShoppingCart, FiStar } from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = [
    { icon: <FiShoppingCart />, label: 'Total Orders', value: '1,234' },
    { icon: <FiUsers />, label: 'Active Users', value: '856' },
    { icon: <FiTrendingUp />, label: 'Revenue Today', value: '₹45,230' },
    { icon: <FiStar />, label: 'Avg Rating', value: '4.6/5' },
  ];

  const salesData = [
    { date: 'Mon', sales: 4000 },
    { date: 'Tue', sales: 3000 },
    { date: 'Wed', sales: 2000 },
    { date: 'Thu', sales: 2780 },
    { date: 'Fri', sales: 1890 },
    { date: 'Sat', sales: 2390 },
    { date: 'Sun', sales: 3490 },
  ];

  const topItems = [
    { name: 'Butter Chicken', orders: 245 },
    { name: 'Masala Dosa', orders: 198 },
    { name: 'Biryani', orders: 187 },
    { name: 'Paneer Tikka', orders: 156 },
    { name: 'Samosa', orders: 142 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-dark dark:text-white mb-8">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-soft hover:shadow-medium transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">{stat.label}</p>
                    <p className="text-3xl font-bold text-dark dark:text-white mt-2">{stat.value}</p>
                  </div>
                  <div className="text-4xl text-primary-500">{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-4 border-b border-gray-200 dark:border-gray-700">
            {['overview', 'orders', 'menu', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition capitalize ${
                  activeTab === tab
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-dark dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Sales Chart */}
              <motion.div
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Weekly Sales</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={salesData}>
                    <CartesianGrid stroke="#e5e7eb" />
                    <XAxis stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#f0b32f" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Top Items */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Top Items List */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">Top Menu Items</h3>
                  <div className="space-y-4">
                    {topItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-dark dark:text-white font-semibold">{item.name}</span>
                        <span className="badge badge-primary">{item.orders} orders</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Items Chart */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft">
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">Item Popularity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topItems}>
                      <CartesianGrid stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#f0b32f" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 text-sm text-dark dark:text-white">#ORD{i}234</td>
                        <td className="px-6 py-4 text-sm text-dark dark:text-white">Student {i}</td>
                        <td className="px-6 py-4 text-sm text-dark dark:text-white font-semibold">₹{250 * i}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`badge ${i % 2 === 0 ? 'badge-success' : 'badge-primary'}`}>
                            {i % 2 === 0 ? 'Completed' : 'In Progress'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-primary-500 hover:text-primary-600 font-semibold">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'menu' && (
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Menu Management</h2>
              <button className="btn-primary mb-6">Add New Item</button>
              <p className="text-gray-600 dark:text-gray-400">Menu management features coming soon...</p>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Advanced Analytics</h2>
              <p className="text-gray-600 dark:text-gray-400">Detailed analytics coming soon...</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
