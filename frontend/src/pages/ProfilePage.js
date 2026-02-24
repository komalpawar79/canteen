import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiLogOut, FiClock, FiCheckCircle, FiXCircle, FiPackage, FiSave, FiX, FiCamera } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useOrderStore from '../store/orderStore';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, isAuthenticated, updateUser } = useAuthStore();
  const { orders, fetchUserOrders, initWebSocket } = useOrderStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    universityId: '',
    department: '',
    profileImage: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Auth Guard - Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // ✅ Fetch orders and init WebSocket on mount
  useEffect(() => {
    if (user) {
      fetchUserOrders();
      initWebSocket();
      setEditData({
        name: user.name || '',
        phone: user.phone || '',
        universityId: user.universityId || '',
        department: user.department || '',
        profileImage: user.profileImage || ''
      });
      setImagePreview(user.profileImage || null);
    }
  }, [user, fetchUserOrders, initWebSocket]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      preparing: 'badge-primary',
      ready: 'badge-success',
      completed: 'badge-success',
      cancelled: 'badge-error'
    };
    return colors[status] || 'badge-secondary';
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editData)
      });
      const data = await response.json();
      
      if (data.success) {
        updateUser(data.user);
        setImagePreview(data.user.profileImage || null);
        setEditData({
          name: data.user.name || '',
          phone: data.user.phone || '',
          universityId: data.user.universityId || '',
          department: data.user.department || '',
          profileImage: data.user.profileImage || ''
        });
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditData({ ...editData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ If not authenticated, show loading while redirecting
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-4">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {(isEditing ? imagePreview : user?.profileImage) ? (
                      <img src={isEditing ? imagePreview : user?.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer hover:bg-primary-600 transition">
                      <FiCamera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-dark dark:text-white mb-2">{user?.name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
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
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                ) : (
                  <p className="text-lg text-dark dark:text-white font-semibold">{user?.name}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-lg text-dark dark:text-white font-semibold">{user?.phone || 'Not set'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">University ID</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.universityId}
                    onChange={(e) => setEditData({ ...editData, universityId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter university ID"
                  />
                ) : (
                  <p className="text-lg text-dark dark:text-white font-semibold">{user?.universityId || 'Not set'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">Department</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.department}
                    onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter department"
                  />
                ) : (
                  <p className="text-lg text-dark dark:text-white font-semibold">{user?.department || 'Not set'}</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">Role</p>
                <p className="text-lg text-dark dark:text-white font-semibold capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-1">Loyalty Points</p>
                <p className="text-lg text-primary-500 font-bold">2,450 ⭐</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <FiSave /> Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    <FiX /> Cancel
                  </button>
                </>
              ) : null}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>

          {/* Order History */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-soft p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark dark:text-white">Recent Orders</h2>
              <button
                onClick={() => navigate('/my-orders')}
                className="text-primary-500 hover:text-primary-600 font-semibold"
              >
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No orders yet</p>
                  <button
                    onClick={() => navigate('/menu')}
                    className="btn-primary px-6 py-2"
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
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
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-dark dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark dark:text-white">
                        {order.items?.map(item => item.menuItem?.name).join(', ') || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark dark:text-white font-semibold">
                        ₹{order.finalAmount}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`badge ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button 
                          onClick={() => navigate(`/order-tracking/${order._id}`)}
                          className="text-primary-500 hover:text-primary-600 font-semibold"
                        >
                          Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
