// client/src/components/Charts/CategoryChart.jsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCategoryBreakdown } from '../../services/dashboardService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];

const CategoryChart = ({ chartType = 'pie' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getCategoryBreakdown();
      const categories = response.data;
      setData(categories);
      const total = categories.reduce((sum, cat) => sum + cat.count, 0);
      setTotalItems(total);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No category data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalItems) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">Items: {payload[0].value}</p>
          <p className="text-sm text-blue-600">Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Items by Category</h3>
        <div className="text-sm text-gray-500">Total: {totalItems} items</div>
      </div>
      
      <div className="h-80">
        {chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Number of Items" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-1 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span className="text-gray-600">{entry._id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;