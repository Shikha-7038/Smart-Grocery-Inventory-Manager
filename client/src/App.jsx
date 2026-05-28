// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroceryManagement from './pages/GroceryManagement';
import Inventory from './pages/Inventory';
import ShoppingList from './pages/ShoppingList';
import Profile from './pages/Profile';

// Layout
import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/groceries"
              element={
                <>
                  <Navbar />
                  <GroceryManagement />
                </>
              }
            />
            <Route
              path="/inventory"
              element={
                <>
                  <Navbar />
                  <Inventory />
                </>
              }
            />
            <Route
              path="/shopping-list"
              element={
                <>
                  <Navbar />
                  <ShoppingList />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;