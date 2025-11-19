import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Add Expense', path: '/add-expense', icon: '➕' },
    { name: 'Reports', path: '/reports', icon: '📈' },
  ];

  const settingsItems = [
    { name: 'Categories', path: '/settings/categories', icon: '🏷️' },
    { name: 'Budgets', path: '/settings/budgets', icon: '💰' },
  ];

  const isActive = (path) => location.pathname === path;
  const isSettingsActive = () => location.pathname.startsWith('/settings');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:z-50">
      <div className="flex flex-col flex-grow bg-indigo-700 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <h1 className="text-2xl font-bold text-white">💰 Budget Tracker</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {/* Regular Navigation Items */}
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              <span className="text-2xl mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}

          {/* Settings Section with Dropdown */}
          <div>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`w-full group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                isSettingsActive()
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                Settings
              </div>
              <span className={`transition-transform ${settingsOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Submenu */}
            {settingsOpen && (
              <div className="ml-4 mt-2 space-y-1">
                {settingsItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-indigo-800 text-white'
                        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
          <div className="flex flex-col w-full">
            <p className="text-sm font-medium text-white truncate mb-2">
              {user?.email}
            </p>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
