// client/src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const response = await updateProfile(updateData);
      // Update user context with new data
      await login(formData.email, formData.password || 'dummy');
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl text-blue-600 font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-blue-100">{user?.email}</p>
                <p className="text-blue-100 text-sm mt-1">Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {!isEditing ? (
              // View Mode
              <div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-gray-900 font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email Address</label>
                    <p className="text-gray-900 font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Account Type</label>
                    <p className="text-gray-900 font-medium capitalize">{user?.role || 'User'}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password (optional)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {formData.password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        password: '',
                        confirmPassword: '',
                      });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">-</p>
              <p className="text-sm text-gray-500">Items Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">-</p>
              <p className="text-sm text-gray-500">Shopping Lists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;