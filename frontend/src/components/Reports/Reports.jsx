import React, { useState, useEffect } from 'react';
import { getMonthlyReport } from '../../services/api';
import MonthSelector from '../Dashboard/MonthSelector';
import toast from 'react-hot-toast';

const Reports = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-20">
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

        {/* Detailed Report Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {report.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No data available for this month
            </div>
          ) : (
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
                    <tr key={item.category.id}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;