import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getBudgets, getExpenses } from '../../services/api';
import CategoryCard from './CategoryCard';
import MonthSelector from './MonthSelector';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, budgetsRes, expensesRes] = await Promise.all([
        getCategories(),
        getBudgets(selectedMonth, selectedYear),
        getExpenses({ month: selectedMonth, year: selectedYear })
      ]);

      setCategories(categoriesRes.data);
      setBudgets(budgetsRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const calculateCategoryStats = (categoryId) => {
    const budget = budgets.find(b => b.categoryId._id === categoryId);
    const categoryExpenses = expenses.filter(e => e.categoryId._id === categoryId);
    const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetAmount = budget ? budget.amount : 0;
    const remaining = budgetAmount - spent;

    return { spent, budget: budgetAmount, remaining };
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {months[selectedMonth - 1]} {selectedYear}
              </p>
            </div>
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No categories found. Create your first category to get started!
            </p>
            <button
              onClick={() => navigate('/settings/categories')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const stats = calculateCategoryStats(category._id);
              return (
                <CategoryCard
                  key={category._id}
                  category={category}
                  {...stats}
                />
              );
            })}
          </div>
        )}

        {/* Add Expense FAB */}
        <button
          onClick={() => navigate('/add-expense')}
          className="fixed bottom-24 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center text-3xl font-light"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Dashboard;