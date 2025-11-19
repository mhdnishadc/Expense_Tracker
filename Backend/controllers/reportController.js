const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Get all categories for the user
    const categories = await Category.find({ userId: req.userId });

    // Get all budgets for the month
    const budgets = await Budget.find({
      userId: req.userId,
      month: monthNum,
      year: yearNum
    });

    // Get all expenses for the month
    const expenses = await Expense.find({ userId: req.userId });

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() + 1 === monthNum && 
             expenseDate.getFullYear() === yearNum;
    });

    // Build report
    const report = categories.map(category => {
      const budget = budgets.find(b => b.categoryId.toString() === category._id.toString());
      const categoryExpenses = filteredExpenses.filter(
        e => e.categoryId.toString() === category._id.toString()
      );

      const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
      const budgetAmount = budget ? budget.amount : 0;
      const remaining = budgetAmount - spent;

      return {
        category: {
          id: category._id,
          name: category.name,
          color: category.color
        },
        spent,
        budget: budgetAmount,
        remaining,
        isOverBudget: remaining < 0
      };
    });

    res.json({
      month: monthNum,
      year: yearNum,
      report
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};