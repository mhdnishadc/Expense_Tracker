import React, { useState, useEffect } from 'react';
import { getMonthlyReport } from '../../services/api';
import MonthSelector from '../Dashboard/MonthSelector';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const Reports = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(true); // Toggle between chart and table
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    fetchReport();
  }, [selectedMonth, selectedYear]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getMonthlyReport(selectedMonth, selectedYear);
      setReport(response.data.report);
    } catch (error) {
      toast.error('Failed to load report');
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

  const totalSpent = report.reduce((sum, item) => sum + item.spent, 0);
  const totalBudget = report.reduce((sum, item) => sum + item.budget, 0);
  const totalRemaining = totalBudget - totalSpent;

  // Prepare data for chart
  const chartData = report.map((item) => ({
    name: item.category.name,
    spent: item.spent,
    budget: item.budget,
    remaining: item.remaining,
    color: item.category.color,
    isOverBudget: item.isOverBudget
  }));

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Spent:</span> ₹{data.spent.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Budget:</span> ₹{data.budget.toFixed(2)}
          </p>
          <p className={`text-sm font-semibold ${data.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span className="font-medium">Remaining:</span> ₹{data.remaining.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly Report</h1>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Budget</p>
            <p className="text-3xl font-bold text-gray-900">₹{totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Remaining</p>
            <p className={`text-3xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{totalRemaining.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Toggle Buttons */}
        {report.length > 0 && (
          <div className="flex justify-end mb-4 gap-2">
            <button
              onClick={() => setShowChart(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showChart
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              📊 Chart View
            </button>
            <button
              onClick={() => setShowChart(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showChart
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              📋 Table View
            </button>
          </div>
        )}

        {/* Chart or Table View */}
        {report.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No data available for this month</p>
            <p className="text-gray-400 text-sm mt-2">Add some expenses to see your report</p>
          </div>
        ) : (
          <>
            {/* Chart View */}
            {showChart && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Spending Overview</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="spent" name="Spent" fill="#EF4444">
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.isOverBudget ? '#EF4444' : '#10B981'} 
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="budget" name="Budget" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Within Budget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-gray-600">Over Budget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Budget Limit</span>
                  </div>
                </div>
              </div>
            )}

            {/* Table View */}
            {!showChart && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Spent
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Budget
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Remaining
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.map((item) => (
                        <tr key={item.category.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: item.category.color }}
                              />
                              <span className="text-sm font-medium text-gray-900">
                                {item.category.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">
                            ₹{item.spent.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-900">
                            ₹{item.budget.toFixed(2)}
                          </td>
                          <td className={`px-6 py-4 text-right text-sm font-semibold ${
                            item.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ₹{item.remaining.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.isOverBudget ? (
                              <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                                OVER
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                                OK
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;