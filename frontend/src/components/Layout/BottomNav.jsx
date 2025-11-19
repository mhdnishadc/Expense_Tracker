import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/add-expense', label: 'Add', icon: '➕' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' } // single settings entry
  ];

  const settingsItems = [
    { path: '/settings/categories', label: 'Categories', icon: '🏷️' },
    { path: '/settings/budgets', label: 'Budgets', icon: '💰' }
  ];

  const isSettingsActive = location.pathname.startsWith('/settings');

  const handleSettingsToggle = () => {
    setSettingsOpen((s) => !s);
  };

  const goTo = (path) => {
    setSettingsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Inline submenu - appears directly above the bottom nav when settingsOpen is true */}
      {settingsOpen && (
        <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden">
          <div className="mx-4 mb-2 rounded-lg bg-white ring-1 ring-black ring-opacity-5 shadow">
            <div className="flex">
              {settingsItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => goTo(item.path)}
                  className={`flex-1 px-3 py-3 text-center text-sm font-medium border-r last:border-r-0 transition-colors ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xl">{item.icon}</div>
                  <div className="text-xs mt-1">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-30">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive =
              item.path === '/settings'
                ? isSettingsActive
                : location.pathname === item.path;

            if (item.path === '/settings') {
              return (
                <button
                  key={item.path}
                  onClick={handleSettingsToggle}
                  className={`flex flex-col items-center justify-center flex-1 h-full focus:outline-none ${
                    isActive ? 'text-indigo-600' : 'text-gray-600'
                  }`}
                  aria-expanded={settingsOpen}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full ${
                  isActive ? 'text-indigo-600' : 'text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
