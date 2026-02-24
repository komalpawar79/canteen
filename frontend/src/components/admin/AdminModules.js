import React, { useState, useEffect } from 'react';
import api from '../../services/api';

// Category Management
export const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/dashboard/categories');
      setCategories(res.data?.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    await api.post('/admin/dashboard/categories', { name });
    setName('');
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/admin/dashboard/categories/${id}`);
    fetchCategories();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Category Management</h2>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={addCategory} className="flex gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-4 py-2 border rounded-lg"
            required
          />
          <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
            Add Category
          </button>
        </form>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <span className="font-medium">{cat.name}</span>
            <button onClick={() => deleteCategory(cat._id)} className="text-red-600 hover:text-red-800">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Management
export const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/dashboard/orders', { params: { page, limit: 20 } });
      setOrders(res.data?.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/dashboard/orders/${id}/status`, { status });
    fetchOrders();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Order Management</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canteen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 text-sm">{order._id.slice(-8)}</td>
                <td className="px-6 py-4">{order.user?.name}</td>
                <td className="px-6 py-4">{order.canteen?.name}</td>
                <td className="px-6 py-4">₹{order.finalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Transaction Management
export const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/dashboard/transactions');
      setTransactions(res.data?.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Payment & Transactions</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((txn) => (
              <tr key={txn._id}>
                <td className="px-6 py-4 text-sm">{txn._id.slice(-8)}</td>
                <td className="px-6 py-4">{txn.user?.name}</td>
                <td className="px-6 py-4">{txn.type}</td>
                <td className="px-6 py-4">₹{txn.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    txn.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{new Date(txn.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reports Module
export const ReportsModule = () => {
  const [reportType, setReportType] = useState('revenue');
  const [format, setFormat] = useState('json');

  const generateReport = async () => {
    const res = await api.get(`/admin/dashboard/reports/${reportType}`, {
      params: { format },
      responseType: format === 'csv' ? 'blob' : 'json'
    });

    if (format === 'csv') {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report.csv`);
      document.body.appendChild(link);
      link.click();
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Reports & Downloads</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option value="revenue">Revenue Report</option>
              <option value="canteen-performance">Canteen Performance</option>
              <option value="user-activity">User Activity</option>
              <option value="item-sales">Item Sales</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
        <button onClick={generateReport} className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
          Generate Report
        </button>
      </div>
    </div>
  );
};

// Subscription Plans
export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/admin/dashboard/plans');
      setPlans(res.data?.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Subscription Plans</h2>
      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-orange-600 mb-4">₹{plan.price}</p>
            <ul className="space-y-2 text-sm">
              {plan.features?.map((f, i) => <li key={i}>✓ {f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Notification Center
export const NotificationCenter = () => {
  const [type, setType] = useState('email');
  const [message, setMessage] = useState('');

  const sendNotification = async (e) => {
    e.preventDefault();
    await api.post('/admin/dashboard/notify/email', { type, message, recipients: [] });
    setMessage('');
    alert('Notification sent!');
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Notification Center</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={sendNotification}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              rows="4"
              required
            />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
            Send Notification
          </button>
        </form>
      </div>
    </div>
  );
};

// System Settings
export const SystemSettings = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">System Settings</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">System configuration options will be displayed here.</p>
      </div>
    </div>
  );
};

// Health Monitoring
export const HealthMonitoring = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await api.get('/admin/dashboard/health');
      setHealth(res.data?.health || null);
    } catch (error) {
      console.error('Error fetching health:', error);
      setHealth(null);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Platform Health</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600 font-semibold">{health?.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-green-600 font-semibold">{health?.database}</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span className="font-semibold">{Math.floor(health?.uptime / 60)} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
