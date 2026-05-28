// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getRecentItems, getCategoryBreakdown } from '../services/dashboardService';
import { getAllAlerts } from '../services/alertService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentItems, setRecentItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recentRes, categoriesRes, alertsRes] = await Promise.all([
        getDashboardStats(),
        getRecentItems(),
        getCategoryBreakdown(),
        getAllAlerts(),
      ]);

      setStats(statsRes.data);
      setRecentItems(recentRes.data);
      setCategories(categoriesRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your grocery summary</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalItems || 0}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalCategories || 0}</p>
              </div>
              <div className="text-3xl">🏷️</div>
            </div>
          </div>

          <Link to="/shopping-list" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Low Stock Items</p>
                <p className="text-3xl font-bold text-red-600">{stats?.totalLowStock || 0}</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Expiring Soon</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.totalExpiringSoon || 0}</p>
              </div>
              <div className="text-3xl">⏰</div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {(alerts?.lowStock?.totalLowStock > 0 || alerts?.expiry?.totalExpiringSoon > 0) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ Alerts</h2>
            <div className="space-y-3">
              {alerts?.lowStock?.totalLowStock > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">
                    🔴 {alerts.lowStock.totalLowStock} item(s) are low in stock!
                    <Link to="/shopping-list" className="ml-2 text-red-600 underline">View shopping list</Link>
                  </p>
                </div>
              )}
              {alerts?.expiry?.totalExpiringSoon > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    🟡 {alerts.expiry.totalExpiringSoon} item(s) will expire soon!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Items by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Added</h2>
            <div className="space-y-3">
              {recentItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items added yet</p>
              ) : (
                recentItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Qty: {item.quantity} {item.unit}
                      </p>
                      <p className={`text-xs ${item.quantity <= item.minStockLevel ? 'text-red-600' : 'text-green-600'}`}>
                        {item.quantity <= item.minStockLevel ? 'Low Stock' : 'In Stock'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center">
              <Link to="/groceries" className="text-blue-600 hover:text-blue-800 text-sm">
                View All Items →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/groceries"
            className="bg-blue-600 text-white rounded-lg p-4 text-center hover:bg-blue-700 transition-colors"
          >
            <div className="text-2xl mb-2">➕</div>
            <p className="font-medium">Add New Item</p>
          </Link>
          <Link
            to="/shopping-list"
            className="bg-green-600 text-white rounded-lg p-4 text-center hover:bg-green-700 transition-colors"
          >
            <div className="text-2xl mb-2">🛒</div>
            <p className="font-medium">View Shopping List</p>
          </Link>
          <Link
            to="/inventory"
            className="bg-purple-600 text-white rounded-lg p-4 text-center hover:bg-purple-700 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <p className="font-medium">Manage Inventory</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;