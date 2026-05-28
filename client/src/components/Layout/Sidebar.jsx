// client/src/components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/groceries', name: 'Groceries', icon: '🛒' },
    { path: '/inventory', name: 'Inventory', icon: '📦' },
    { path: '/shopping-list', name: 'Shopping List', icon: '📝' },
    { path: '/profile', name: 'Profile', icon: '👤' },
  ];

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <>
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  // Mobile Sidebar (Drawer)
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={onClose}
          />
        )}
        
        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <SidebarContent />
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-30">
      <div className="flex flex-col h-full">
        <SidebarContent />
      </div>
    </aside>
  );
};

export default Sidebar;