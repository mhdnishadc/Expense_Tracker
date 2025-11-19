import React, { useState, useEffect } from 'react';
import { getCategories, getBudgets, createOrUpdateBudget } from '../../services/api';
import MonthSelector from '../Dashboard/MonthSelector';
import toast from 'react-hot-toast';

const Budgets = () => {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      const [categoriesRes, budgetsRes] = await Promise.all([
        getCategories(),
        getBudgets(selectedMonth, selectedYear)
      ]);

      setCategories(categoriesRes.data);

      const budgetMap = {};
      budgetsRes.data.forEach(budget => {
        budgetMap[budget.categoryId._id] = budget.amount;
      });
      setBudgets(budgetMap);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleBudgetChange = (categoryId, value) => {
    setBudgets({
      ...budgets,
      [categoryId]: value
    });
  };

  const handleSave = async (categoryId) => {
    const amount = parseFloat(budgets[categoryId]);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }

    setLoading(true);

    try {
      await createOrUpdateBudget({
        categoryId,
        amount,
        month: selectedMonth,
        year: selectedYear
      });

      toast.success('Budget saved successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly Budgets</h1>
            <p className="text-gray-600 mt-1">
              Set limits for {months[selectedMonth - 1]} {selectedYear}
            </p>
          </div>
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Budgets List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No categories found. Create categories first!
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">₹</span>
                      <input
                        type="number"
                        value={budgets[category._id] || ''}
                        onChange={(e) => handleBudgetChange(category._id, e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleSave(category._id)}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budgets;