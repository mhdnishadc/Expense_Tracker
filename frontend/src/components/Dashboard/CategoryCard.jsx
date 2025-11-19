import React from 'react';

const CategoryCard = ({ category, spent, budget, remaining }) => {
  const isOverBudget = remaining < 0;
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
        </div>
        {isOverBudget && (
          <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
            OVER BUDGET
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isOverBudget ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Amounts */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Spent:</span>
          <span className="font-semibold text-gray-800">₹{spent.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Budget:</span>
          <span className="font-semibold text-gray-800">₹{budget.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Remaining:</span>
          <span
            className={`font-semibold ${
              isOverBudget ? 'text-red-600' : 'text-green-600'
            }`}
          >
            ₹{remaining.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;