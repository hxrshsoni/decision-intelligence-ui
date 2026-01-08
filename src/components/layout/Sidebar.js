import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, FiUpload, FiFileText, FiSettings, 
  FiLogOut, FiPieChart, FiTrendingUp 
} from 'react-icons/fi';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard', color: 'blue' },
    { path: '/upload', icon: FiUpload, label: 'Upload Data', color: 'green' },
    { path: '/reports', icon: FiFileText, label: 'Generate Report', color: 'purple' },
    { path: '/analytics', icon: FiPieChart, label: 'Analytics', color: 'orange' },
    { path: '/insights', icon: FiTrendingUp, label: 'Insights', color: 'teal' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-xl h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Decision AI
        </h2>
        <p className="text-sm text-gray-500 mt-1">Weekly Business Advisor</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="text-xl" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
