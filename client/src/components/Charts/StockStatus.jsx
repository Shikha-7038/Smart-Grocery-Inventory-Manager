// client/src/components/Charts/StockStatus.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDashboardStats } from '../../services/dashboardService';

const StockStatus = ({ chartType = 'area' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getDashboardStats();
      // Transform data for chart
      const mockData = generateMockData();
      setData(mockData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const today = new Date();
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      data.push({
        date: date.toLocaleDateString(),
        inStock: Math.floor(Math.random() * 20) + 10,
        lowStock: Math.floor(Math.random() * 5),
        outOfStock: Math.floor(Math.random() * 3),
      });
    }
    return data;
  };

  const getFilteredData = () => {
    const ranges = {
      week: 7,
      month: 30,
      quarter: 90,
    };
    const days = ranges[timeRange] || 30;
    return data.slice(-days);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const filteredData = getFilteredData();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Stock Health Trend</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('quarter')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              timeRange === 'quarter' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Quarter
          </button>
        </div>
      </div>

      <div className="h-80">
        {chartType === 'area' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="inStock" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="In Stock" />
              <Area type="monotone" dataKey="lowStock" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Low Stock" />
              <Area type="monotone" dataKey="outOfStock" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Out of Stock" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inStock" stroke="#10b981" strokeWidth={2} name="In Stock" />
              <Line type="monotone" dataKey="lowStock" stroke="#f59e0b" strokeWidth={2} name="Low Stock" />
              <Line type="monotone" dataKey="outOfStock" stroke="#ef4444" strokeWidth={2} name="Out of Stock" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {filteredData[filteredData.length - 1]?.inStock || 0}
          </p>
          <p className="text-xs text-gray-500">Currently In Stock</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {filteredData[filteredData.length - 1]?.lowStock || 0}
          </p>
          <p className="text-xs text-gray-500">Low Stock Items</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {filteredData[filteredData.length - 1]?.outOfStock || 0}
          </p>
          <p className="text-xs text-gray-500">Out of Stock</p>
        </div>
      </div>
    </div>
  );
};

export default StockStatus;