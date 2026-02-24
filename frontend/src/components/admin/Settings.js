import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, Settings as SettingsIcon, User, Building2, Clock, Menu, Heart, Shield } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  // Admin Profile
  const [profileForm, setProfileForm] = useState({
    adminProfile: {
      name: 'Admin',
      email: '',
      mobile: '',
      profilePicture: ''
    }
  });

  // Restaurant Settings
  const [restaurantForm, setRestaurantForm] = useState({
    restaurantSettings: {
      name: 'Campus Canteen',
      address: 'University Main Block, Near Library, Mumbai',
      contactNumber: '',
      websiteLogo: '',
      appLogo: '',
      isOpen: true
    }
  });

  // Operating Hours
  const [hoursForm, setHoursForm] = useState({
    operatingHours: {
      opening: '09:00',
      closing: '22:00',
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  });

  // Menu Settings
  const [menuForm, setMenuForm] = useState({
    menuSettings: {
      itemsEnabled: true,
      allowPriceChange: true,
      categories: ['Food', 'Beverage', 'Snacks', 'Desserts']
    }
  });

  // Health Status
  const [healthForm, setHealthForm] = useState({
    healthStatus: {
      status: 'Healthy',
      maintenanceMode: false,
      maintenanceMessage: '',
      healthNotes: ''
    }
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard/settings');
      const data = res.data?.settings;
      
      if (data) {
        setSettings(data);
        setProfileForm({ adminProfile: data.adminProfile || { name: 'Admin', email: '', mobile: '', profilePicture: '' } });
        setRestaurantForm({ restaurantSettings: data.restaurantSettings || { name: 'Campus Canteen', address: 'University Main Block, Near Library, Mumbai', contactNumber: '', websiteLogo: '', appLogo: '', isOpen: true } });
        setHoursForm({ operatingHours: data.operatingHours || { opening: '09:00', closing: '22:00', operatingDays: days } });
        setMenuForm({ menuSettings: data.menuSettings || { itemsEnabled: true, allowPriceChange: true, categories: ['Food', 'Beverage', 'Snacks', 'Desserts'] } });
        setHealthForm({ healthStatus: data.healthStatus || { status: 'Healthy', maintenanceMode: false, maintenanceMessage: '', healthNotes: '' } });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      await api.put('/admin/dashboard/settings', profileForm);
      toast.success('Profile updated successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const saveRestaurant = async () => {
    try {
      setSaving(true);
      await api.put('/admin/dashboard/settings', restaurantForm);
      toast.success('Restaurant settings updated successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save restaurant settings');
    } finally {
      setSaving(false);
    }
  };

  const saveHours = async () => {
    try {
      setSaving(true);
      await api.put('/admin/dashboard/settings', hoursForm);
      toast.success('Operating hours updated successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save operating hours');
    } finally {
      setSaving(false);
    }
  };

  const saveMenuSettings = async () => {
    try {
      setSaving(true);
      await api.put('/admin/dashboard/settings', menuForm);
      toast.success('Menu settings updated successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save menu settings');
    } finally {
      setSaving(false);
    }
  };

  const saveHealthStatus = async () => {
    try {
      setSaving(true);
      await api.put('/admin/dashboard/settings', healthForm);
      toast.success('Health status updated successfully');
      fetchSettings();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save health status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon size={32} className="text-orange-600" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your admin profile, restaurant settings, and system configuration</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'profile', label: 'Admin Profile', icon: User },
            { id: 'restaurant', label: 'Restaurant Info', icon: Building2 },
            { id: 'hours', label: 'Operating Hours', icon: Clock },
            { id: 'menu', label: 'Menu Settings', icon: Menu },
            { id: 'health', label: 'Health Status', icon: Heart }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Admin Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User size={28} className="text-orange-600" />
              Admin Profile Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profileForm.adminProfile.name}
                  onChange={(e) => setProfileForm({
                    adminProfile: { ...profileForm.adminProfile, name: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profileForm.adminProfile.email}
                  onChange={(e) => setProfileForm({
                    adminProfile: { ...profileForm.adminProfile, email: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={profileForm.adminProfile.mobile}
                  onChange={(e) => setProfileForm({
                    adminProfile: { ...profileForm.adminProfile, mobile: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                <input
                  type="url"
                  value={profileForm.adminProfile.profilePicture}
                  onChange={(e) => setProfileForm({
                    adminProfile: { ...profileForm.adminProfile, profilePicture: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Info Tab */}
        {activeTab === 'restaurant' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 size={28} className="text-orange-600" />
              Restaurant / System Settings
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                <input
                  type="text"
                  value={restaurantForm.restaurantSettings.name}
                  onChange={(e) => setRestaurantForm({
                    restaurantSettings: { ...restaurantForm.restaurantSettings, name: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={restaurantForm.restaurantSettings.address}
                  onChange={(e) => setRestaurantForm({
                    restaurantSettings: { ...restaurantForm.restaurantSettings, address: e.target.value }
                  })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  value={restaurantForm.restaurantSettings.contactNumber}
                  onChange={(e) => setRestaurantForm({
                    restaurantSettings: { ...restaurantForm.restaurantSettings, contactNumber: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website Logo URL</label>
                <input
                  type="url"
                  value={restaurantForm.restaurantSettings.websiteLogo}
                  onChange={(e) => setRestaurantForm({
                    restaurantSettings: { ...restaurantForm.restaurantSettings, websiteLogo: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">App Logo URL</label>
                <input
                  type="url"
                  value={restaurantForm.restaurantSettings.appLogo}
                  onChange={(e) => setRestaurantForm({
                    restaurantSettings: { ...restaurantForm.restaurantSettings, appLogo: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  placeholder="https://example.com/app-logo.png"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isOpen"
                  checked={restaurantForm.restaurantSettings.isOpen}
                  onChange={(e) => setRestaurantForm({
                    restaurantSettings: { ...restaurantForm.restaurantSettings, isOpen: e.target.checked }
                  })}
                  className="w-5 h-5 text-orange-600 rounded"
                />
                <label htmlFor="isOpen" className="text-sm font-medium text-gray-700">
                  Restaurant is Open
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveRestaurant}
                  disabled={saving}
                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Restaurant Info'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Operating Hours Tab */}
        {activeTab === 'hours' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock size={28} className="text-orange-600" />
              Operating Hours
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                  <input
                    type="time"
                    value={hoursForm.operatingHours.opening}
                    onChange={(e) => setHoursForm({
                      operatingHours: { ...hoursForm.operatingHours, opening: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                  <input
                    type="time"
                    value={hoursForm.operatingHours.closing}
                    onChange={(e) => setHoursForm({
                      operatingHours: { ...hoursForm.operatingHours, closing: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Operating Days</label>
                <div className="grid grid-cols-2 gap-3">
                  {days.map(day => (
                    <label key={day} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={hoursForm.operatingHours.operatingDays.includes(day)}
                        onChange={(e) => {
                          const newDays = e.target.checked
                            ? [...hoursForm.operatingHours.operatingDays, day]
                            : hoursForm.operatingHours.operatingDays.filter(d => d !== day);
                          setHoursForm({
                            operatingHours: { ...hoursForm.operatingHours, operatingDays: newDays }
                          });
                        }}
                        className="w-4 h-4 text-orange-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveHours}
                  disabled={saving}
                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Operating Hours'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Settings Tab */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Menu size={28} className="text-orange-600" />
              Menu Settings
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="itemsEnabled"
                  checked={menuForm.menuSettings.itemsEnabled}
                  onChange={(e) => setMenuForm({
                    menuSettings: { ...menuForm.menuSettings, itemsEnabled: e.target.checked }
                  })}
                  className="w-5 h-5 text-orange-600 rounded"
                />
                <label htmlFor="itemsEnabled" className="text-sm font-medium text-gray-700">
                  Enable Menu Items
                </label>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="allowPrice"
                  checked={menuForm.menuSettings.allowPriceChange}
                  onChange={(e) => setMenuForm({
                    menuSettings: { ...menuForm.menuSettings, allowPriceChange: e.target.checked }
                  })}
                  className="w-5 h-5 text-orange-600 rounded"
                />
                <label htmlFor="allowPrice" className="text-sm font-medium text-gray-700">
                  Allow Price Changes
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Menu Categories</label>
                <div className="space-y-2">
                  {menuForm.menuSettings.categories.map((category, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => {
                          const newCategories = [...menuForm.menuSettings.categories];
                          newCategories[idx] = e.target.value;
                          setMenuForm({
                            menuSettings: { ...menuForm.menuSettings, categories: newCategories }
                          });
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          const newCategories = menuForm.menuSettings.categories.filter((_, i) => i !== idx);
                          setMenuForm({
                            menuSettings: { ...menuForm.menuSettings, categories: newCategories }
                          });
                        }}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setMenuForm({
                    menuSettings: { ...menuForm.menuSettings, categories: [...menuForm.menuSettings.categories, 'New Category'] }
                  })}
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium"
                >
                  Add Category
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveMenuSettings}
                  disabled={saving}
                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Menu Settings'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Health Status Tab */}
        {activeTab === 'health' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Heart size={28} className="text-orange-600" />
              Health Status & Maintenance
            </h2>

            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Operational Status</p>
                  <p className="text-sm text-blue-700 mt-1">Select the current operational status of your system</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">System Health Status</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Healthy', 'Degraded', 'Down'].map(status => (
                    <label
                      key={status}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        healthForm.healthStatus.status === status
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={healthForm.healthStatus.status === status}
                        onChange={() => setHealthForm({
                          healthStatus: { ...healthForm.healthStatus, status }
                        })}
                        className="mr-2"
                      />
                      <span className="font-medium text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <input
                  type="checkbox"
                  id="maintenance"
                  checked={healthForm.healthStatus.maintenanceMode}
                  onChange={(e) => setHealthForm({
                    healthStatus: { ...healthForm.healthStatus, maintenanceMode: e.target.checked }
                  })}
                  className="w-5 h-5 text-orange-600 rounded"
                />
                <div>
                  <label htmlFor="maintenance" className="text-sm font-medium text-gray-700">
                    Enable Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-600 mt-1">When enabled, customers cannot place new orders and see a maintenance message</p>
                </div>
              </div>

              {healthForm.healthStatus.maintenanceMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                  <textarea
                    value={healthForm.healthStatus.maintenanceMessage}
                    onChange={(e) => setHealthForm({
                      healthStatus: { ...healthForm.healthStatus, maintenanceMessage: e.target.value }
                    })}
                    placeholder="e.g., We're updating our systems. We'll be back soon!"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Notes</label>
                <textarea
                  value={healthForm.healthStatus.healthNotes}
                  onChange={(e) => setHealthForm({
                    healthStatus: { ...healthForm.healthStatus, healthNotes: e.target.value }
                  })}
                  placeholder="e.g., Database optimization running from 5 PM to 6 PM. High load detected — monitoring performance."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Last Checked:</span> {new Date().toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveHealthStatus}
                  disabled={saving}
                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Health Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
