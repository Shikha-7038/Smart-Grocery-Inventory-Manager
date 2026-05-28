// client/src/components/Layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🛍️</span>
              <span className="font-bold text-lg">Smart Grocery Manager</span>
            </div>
            <p className="text-sm text-gray-400">
              Smart inventory management to reduce waste and save money.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/groceries" className="text-gray-400 hover:text-white transition-colors">
                  Groceries
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="text-gray-400 hover:text-white transition-colors">
                  Inventory
                </Link>
              </li>
              <li>
                <Link to="/shopping-list" className="text-gray-400 hover:text-white transition-colors">
                  Shopping List
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Inventory Tracking</li>
              <li>✓ Expiry Alerts</li>
              <li>✓ Low Stock Notifications</li>
              <li>✓ Auto Shopping List</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Project Info</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Full Stack MERN Project</li>
              <li>For Educational Purposes</li>
              <li>GitHub Repository Available</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Smart Grocery Inventory Manager. All rights reserved.</p>
          <p className="mt-1">Built with React, Node.js, Express & MongoDB</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;