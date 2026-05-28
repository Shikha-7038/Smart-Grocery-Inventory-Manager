# 🛍️ Smart Grocery List & Inventory Manager

[![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A complete full-stack application to track pantry inventory, predict restocks, auto-generate grocery lists, monitor expiries, and sync across family members.

## 📌 Project Overview

Smart Grocery List & Inventory Manager is a comprehensive web application that helps users manage their grocery inventory efficiently. It solves common problems like forgetting grocery items, overbuying, stock shortages, and product expiration.

### 🎯 Key Features

- ✅ **User Authentication** - Secure JWT-based login/registration
- ✅ **Inventory Management** - Add, edit, delete grocery items
- ✅ **Stock Tracking** - Real-time quantity updates with +/- controls
- ✅ **Low Stock Alerts** - Automatic notifications when items run low
- ✅ **Expiry Monitoring** - Track expiring items with color-coded alerts
- ✅ **Smart Shopping List** - Auto-generate lists from low-stock items
- ✅ **Category Management** - Organize items by categories
- ✅ **Search & Filter** - Find items quickly with powerful filters
- ✅ **Dashboard Analytics** - Visual charts and statistics
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Real-time Updates** - Instant UI updates on stock changes
- ✅ **Bulk Operations** - Select and update multiple items

## 🏗️ Problem Statement

Families, hostels, and small businesses struggle with:
- ❌ Forgetting to buy essential items
- ❌ Overbuying and wasting food
- ❌ Stock shortages at critical times
- ❌ Expired products going unnoticed
- ❌ No centralized inventory tracking

**Our Solution**: A smart, intuitive system that tracks everything and tells you what to buy and when.

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.2.0 | UI Framework |
| Vite | 4.4.5 | Build Tool |
| Tailwind CSS | 3.3.3 | Styling |
| React Router DOM | 6.15.0 | Routing |
| Axios | 1.5.0 | HTTP Client |
| Recharts | 2.8.0 | Charts & Graphs |
| React Hot Toast | 2.4.1 | Notifications |
| JWT Decode | 3.1.2 | Token Handling |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | Runtime |
| Express.js | 4.18.2 | Web Framework |
| MongoDB | 7.x | Database |
| Mongoose | 7.5.0 | ODM |
| JWT | 9.0.2 | Authentication |
| Bcryptjs | 2.4.3 | Password Hashing |
| Helmet | 7.0.0 | Security |
| CORS | 2.8.5 | Cross-origin Resource Sharing |
| Express Validator | 7.0.1 | Input Validation |
| Morgan | 1.10.0 | Logging |

## 📁 Project Structure
```
Smart-Grocery-Inventory-Manager/
│
├── client/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── Layout/
│ │ │ │ ├── Navbar.jsx
│ │ │ │ ├── Sidebar.jsx
│ │ │ │ └── Footer.jsx
│ │ │ ├── Alerts/
│ │ │ │ ├── LowStockAlert.jsx
│ │ │ │ └── ExpiryAlert.jsx
│ │ │ ├── Grocery/
│ │ │ │ ├── GroceryForm.jsx
│ │ │ │ ├── GroceryList.jsx
│ │ │ │ ├── GroceryCard.jsx
│ │ │ │ └── GroceryFilters.jsx
│ │ │ ├── Inventory/
│ │ │ │ ├── InventoryTable.jsx
│ │ │ │ ├── QuantityControls.jsx
│ │ │ │ └── ShoppingList.jsx
│ │ │ └── Charts/
│ │ │ ├── CategoryChart.jsx
│ │ │ └── StockStatus.jsx
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── GroceryManagement.jsx
│ │ │ ├── Inventory.jsx
│ │ │ ├── ShoppingList.jsx
│ │ │ └── Profile.jsx
│ │ ├── services/
│ │ │ ├── api.js
│ │ │ ├── authService.js
│ │ │ ├── groceryService.js
│ │ │ ├── dashboardService.js
│ │ │ └── alertService.js
│ │ ├── context/
│ │ │ ├── AuthContext.jsx
│ │ │ └── AlertContext.jsx
│ │ ├── hooks/
│ │ │ ├── useAuth.js
│ │ │ ├── useInventory.js
│ │ │ ├── useDebounce.js
│ │ │ └── useLocalStorage.js
│ │ ├── utils/
│ │ │ ├── constants.js
│ │ │ ├── helpers.js
│ │ │ └── validation.js
│ │ └── styles/
│ │ └── index.css
│ ├── package.json
│ ├── vite.config.js
│ └── index.html
│
├── server/ # Node.js Backend
│ ├── models/
│ │ ├── User.js
│ │ ├── GroceryItem.js
│ │ └── Inventory.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── groceryRoutes.js
│ │ ├── dashboardRoutes.js
│ │ └── alertRoutes.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── groceryController.js
│ │ ├── dashboardController.js
│ │ └── alertController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ ├── errorMiddleware.js
│ │ └── validationMiddleware.js
│ ├── config/
│ │ ├── db.js
│ │ └── constants.js
│ ├── utils/
│ │ ├── generateToken.js
│ │ ├── alertUtils.js
│ │ └── validators.js
│ ├── server.js
│ └── package.json
│
├── docs/ # Documentation
│ └── screenshots/
│
├── README.md
├── .gitignore
└── .env.example
```

## 🔌 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Private |
| PUT | `/api/auth/profile` | Update profile | Private |

### Grocery Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/grocery` | Get all items | Private |
| POST | `/api/grocery` | Create new item | Private |
| GET | `/api/grocery/:id` | Get single item | Private |
| PUT | `/api/grocery/:id` | Update item | Private |
| DELETE | `/api/grocery/:id` | Delete item | Private |
| PATCH | `/api/grocery/:id/quantity` | Update quantity | Private |

### Dashboard Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get statistics | Private |
| GET | `/api/dashboard/recent` | Get recent items | Private |
| GET | `/api/dashboard/categories` | Get category breakdown | Private |
| GET | `/api/dashboard/shopping-list` | Generate shopping list | Private |

### Alert Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/alerts/low-stock` | Get low stock alerts | Private |
| GET | `/api/alerts/expiry` | Get expiry alerts | Private |
| GET | `/api/alerts/all` | Get all alerts | Private |

## 📦 Installation Guide

### Prerequisites

```bash
# Check Node.js version (v18 or higher)
node --version

# Check npm version
npm --version

# Check MongoDB Atlas account
# Create account at https://www.mongodb.com/cloud/atlas

## Step 1: Clone the Repository

git clone https://github.com/yourusername/Smart-Grocery-Inventory-Manager.git
cd Smart-Grocery-Inventory-Manager

## Step 2: Backend Setup
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your MongoDB credentials
# Edit .env file with your database URI
.env configuration:

env
PORT=5000
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/grocery_inventory_db
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development

Step 3: Frontend Setup
# Navigate to client folder (from root)
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with backend URL
.env configuration:

env
VITE_API_URL=http://localhost:5000/api

## Step 4: MongoDB Setup
 - Create MongoDB Atlas account (if not already)
 - Create a new cluster (free tier works)
 - Create database: grocery_inventory_db
 - Get connection string
 - Whitelist your IP address (0.0.0.0/0 for development)
 - Add connection string to server/.env

## Step 5: Run the Application
Terminal 1 - Backend:

cd server
npm run dev
Terminal 2 - Frontend:

cd client
npm run dev

## Step 6: Access the Application
 - Frontend: http://localhost:5173
 - Backend API: http://localhost:5000/api
 - Health Check: http://localhost:5000/api/health
```

## 🎯 Usage Guide
# 1. User Registration
 - Navigate to /register
 - Fill in name, email, and password
 - Click "Create Account"

# 2. Adding Grocery Items
 - Go to "Groceries" page
 - Click "+ Add New Item"
 - Fill item details (name, category, quantity, etc.)
 - Click "Add Item"

# 3. Managing Inventory
 - Go to "Inventory" page
 - Use +/- buttons to update quantities
 - View stock status indicators
 - Check expiry dates

# 4. Generating Shopping List
 - Go to "Shopping List" page
 - View automatically generated list from low-stock items
 - Select items to purchase
 - Download PDF or share list

# 5. Monitoring Alerts
 - Dashboard shows alert counts
 - Low stock items trigger alerts
 - Expiring items show warnings
 - Click alerts to view details

## 📊 Database Schema
## Users Collection
```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## GroceryItems Collection
```
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  name: String,
  category: String,
  quantity: Number,
  unit: String,
  minStockLevel: Number,
  expiryDate: Date,
  price: Number,
  barcode: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features
 - ✅ JWT-based authentication
 - ✅ Password hashing with bcrypt
 - ✅ Helmet.js for security headers
 - ✅ CORS configuration
 - ✅ Input validation & sanitization
 - ✅ Protected API routes
 - ✅ Environment variables for sensitive data

## 🚢 Deployment
Deploy Backend (Railway/Render)
```bash
# Push to GitHub
git push origin main

# Connect repository to Railway/Render
# Add environment variables
# Deploy
Deploy Frontend (Vercel/Netlify)
bash
# Build the project
cd client
npm run build

# Deploy dist folder to Vercel/Netlify
# Add environment variables
```

## 🤝 Contributing
 - Fork the repository
 - Create your feature branch (git checkout -b feature/AmazingFeature)
 - Commit changes (git commit -m 'Add AmazingFeature')
 - Push to branch (git push origin feature/AmazingFeature)
 - Open a Pull Request

## 📝 License
 - This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments
 - MongoDB Atlas for free database hosting
 - React and Node.js communities
 - All contributors and testers

## 🎓 Learning Outcomes
This project demonstrates:

 - ✅ Full-stack development with MERN stack
 - ✅ REST API design and implementation
 - ✅ JWT authentication & authorization
 - ✅ Database design with MongoDB & Mongoose
 - ✅ Frontend state management with Context API
 - ✅ Responsive UI with Tailwind CSS
 - ✅ Real-time data updates
 - ✅ Error handling & validation
 - ✅ Git & GitHub workflow
 - ✅ Project documentation

## ⭐ Show Your Support
 - If this project helped you, please give it a ⭐ on GitHub!

## 🚨 Common Issues & Solutions
 - **Issue 1:** MongoDB Connection Error
Solution: Check your MONGO_URI in .env and whitelist your IP in MongoDB Atlas

 - **Issue 2:** CORS Error
Solution: Ensure CLIENT_URL matches your frontend URL in server/.env

 - **Issue 3:** Token Expired
Solution: Login again to get a fresh token

 - **Issue 4:** Port Already in Use
Solution: Change PORT in .env or kill process using the port

 - Made with ❤️ for better grocery management