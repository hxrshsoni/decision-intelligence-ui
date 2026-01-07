import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Decision Intelligence</h1>
          <p className="text-sm text-gray-600">Your Weekly Business Advisor</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={20} className="text-gray-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{user?.businessName || user?.email}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
