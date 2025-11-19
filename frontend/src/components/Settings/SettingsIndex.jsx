import React from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsIndex = () => {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: 'Categories',
      description: 'Manage spending categories and colors',
      icon: '🏷️',
      path: '/settings/categories',
      color: 'bg-blue-500'
    },
    {
      title: 'Budgets',
      description: 'Set monthly budget limits for each category',
      icon: '💰',
      path: '/settings/budgets',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsOptions.map((option) => (
            <button
              key={option.path}
              onClick={() => navigate(option.path)}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow text-left"
            >
              <div className={`w-16 h-16 ${option.color} rounded-lg flex items-center justify-center text-4xl mb-4`}>
                {option.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {option.title}
              </h2>
              <p className="text-gray-600">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsIndex;