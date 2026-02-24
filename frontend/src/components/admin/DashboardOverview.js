import React, { useState, useEffect } from 'react';
import { Users, Store, ShoppingCart, DollarSign, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [orderVolume, setOrderVolume] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchData();
    
    // Set up real-time sync - fetch data every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [s, t, g, v, c] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/dashboard/analytics/top-items'),
        api.get('/admin/dashboard/analytics/user-growth'),
        api.get('/admin/dashboard/analytics/order-volume'),
        api.get('/admin/dashboard/analytics/category-sales')
      ]);
      setStats(s.data.data);
      setTopItems(t.data.data.topItems || []);
      setUserGrowth(g.data.data.growth || []);
      setOrderVolume(v.data.data.volume || []);
      setCategorySales(c.data.data.sales || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
    { label: 'Active Canteens', value: stats?.activeCanteens || 0, icon: Store, color: 'green' },
    { label: 'Orders Today', value: stats?.ordersToday || 0, icon: ShoppingCart, color: 'orange' },
    { label: 'Revenue Today', value: `₹${(stats?.revenueToday || 0).toFixed(2)}`, icon: DollarSign, color: 'purple' }
  ];

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-600 text-sm mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">{card.label}</span>
                <Icon className={`text-${card.color}-500`} size={24} />
              </div>
              <div className="text-3xl font-bold">{card.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">User Growth (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Order Volume (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Top Selling Items</h3>
          <div className="space-y-3">
            {topItems.length > 0 ? (
              topItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-orange-600 font-semibold">{item.totalSold} sold</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No sales data yet</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Category Sales</h3>
          {categorySales.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categorySales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {categorySales.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No category data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
