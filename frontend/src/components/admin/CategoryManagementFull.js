import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CategoryManagementFull = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [canteens, setCanteens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    canteen: '',
    category: 'breakfast',
    dietary: 'veg',
    isAvailable: true
  });

  useEffect(() => {
    fetchMenuItems();
    fetchCanteens();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard/menu-items');
      const items = res.data?.items || [];
      setMenuItems(items);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCanteens = async () => {
    try {
      const res = await api.get('/admin/dashboard/canteens');
      const canteensList = res.data?.canteens || [];
      setCanteens(canteensList);
    } catch (error) {
      console.error('Error fetching canteens:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = editMode
        ? await api.patch(`/admin/dashboard/menu-items/${currentId}`, formData)
        : await api.post('/admin/dashboard/menu-items', formData);
      
      const newItem = response.data.data?.item || response.data.item;
      if (!editMode && newItem) {
        setMenuItems(prev => [newItem, ...prev]);
      } else {
        fetchMenuItems();
      }
      
      toast.success(editMode ? 'Menu item updated!' : 'Menu item created!');
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      canteen: item.canteen?._id || item.canteen,
      category: item.category,
      dietary: item.dietary,
      isAvailable: item.isAvailable
    });
    setCurrentId(item._id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      await api.delete(`/admin/dashboard/menu-items/${id}`);
      setMenuItems(prev => prev.filter(item => item._id !== id));
      toast.success('Menu item deleted!');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      canteen: '',
      category: 'breakfast',
      dietary: 'veg',
      isAvailable: true
    });
    setEditMode(false);
    setCurrentId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Menu Management</h2>
          <p className="text-gray-600 mt-1">Manage menu items for all canteens</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }} 
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition"
        >
          <Plus size={20} />
          Add Menu Item
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold mb-2">No Menu Items Yet</h3>
          <p className="text-gray-600 mb-4">Add your first menu item to get started</p>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-sm opacity-90">{item.canteen?.name || 'No canteen'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.isAvailable ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">₹{item.price}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.dietary === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.dietary.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 capitalize">📂 {item.category}</p>
                
                {item.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                )}

                <div className="pt-3 border-t flex gap-2">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h3 className="text-2xl font-bold">{editMode ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-white hover:text-gray-200">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Item Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Masala Dosa"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Canteen *</label>
                  <select
                    value={formData.canteen}
                    onChange={(e) => setFormData({ ...formData, canteen: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Canteen</option>
                    {canteens.filter(c => c.isActive).map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="50"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                    <option value="special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Dietary *</label>
                  <select
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows="3"
                  placeholder="Brief description of the item"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium cursor-pointer">
                  Available for order
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-semibold">
                  {editMode ? 'Update Item' : 'Create Item'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 border-2 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementFull;
