import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiLogOut } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const orderHistory = [
    { id: 1, date: 'Nov 8, 2025', items: 'Butter Chicken, Naan', amount: '₹380', status: 'Completed' },
    { id: 2, date: 'Nov 6, 2025', items: 'Masala Dosa, Sambar', amount: '₹120', status: 'Completed' },
    { id: 3, date: 'Nov 4, 2025', items: 'Paneer Tikka, Coke', amount: '₹250', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-dark dark:text-white mb-2">{user?.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
              >
                <FiEdit2 /> {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">University ID</p>
                <p className="text-lg text-dark dark:text-white font-semibold">{user?.universityId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">Role</p>
                <p className="text-lg text-dark dark:text-white font-semibold capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">Department</p>
                <p className="text-lg text-dark dark:text-white font-semibold">{user?.department || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">Loyalty Points</p>
                <p className="text-lg text-primary-500 font-bold">2,450 ⭐</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Order History */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-dark dark:text-white mb-6">Order History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-dark dark:text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-dark dark:text-white">{order.date}</td>
                      <td className="px-6 py-4 text-sm text-dark dark:text-white">{order.items}</td>
                      <td className="px-6 py-4 text-sm text-dark dark:text-white font-semibold">{order.amount}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="badge badge-success">{order.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-primary-500 hover:text-primary-600 font-semibold">Reorder</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
