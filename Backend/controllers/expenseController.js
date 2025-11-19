const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

exports.getExpenses = async (req, res) => {
  try {
    const { month, year, categoryId } = req.query;
    const query = { userId: req.userId };

    if (categoryId) query.categoryId = categoryId;

    const expenses = await Expense.find(query).populate('categoryId').sort({ date: -1 });

    // Filter by month/year if provided
    let filteredExpenses = expenses;
    if (month && year) {
      filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() + 1 === parseInt(month) && 
               expenseDate.getFullYear() === parseInt(year);
      });
    }

    res.json(filteredExpenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const { categoryId, amount, date, description } = req.body;

    // Check if category belongs to user
    const category = await Category.findOne({ _id: categoryId, userId: req.userId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const expense = new Expense({
      categoryId,
      userId: req.userId,
      amount,
      date: date || new Date(),
      description
    });

    await expense.save();
    await expense.populate('categoryId');

    // Check budget status
    const expenseDate = new Date(expense.date);
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();

    const budget = await Budget.findOne({
      categoryId,
      userId: req.userId,
      month,
      year
    });

    let budgetStatus = { withinBudget: true, message: 'Expense added successfully' };

    if (budget) {
      // Calculate total spent in this category for the month
      const expenses = await Expense.find({
        categoryId,
        userId: req.userId
      });

      const totalSpent = expenses
        .filter(exp => {
          const d = new Date(exp.date);
          return d.getMonth() + 1 === month && d.getFullYear() === year;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      if (totalSpent > budget.amount) {
        budgetStatus = {
          withinBudget: false,
          message: 'Over budget!',
          spent: totalSpent,
          budget: budget.amount,
          remaining: budget.amount - totalSpent
        };
      } else {
        budgetStatus = {
          withinBudget: true,
          message: 'Within budget',
          spent: totalSpent,
          budget: budget.amount,
          remaining: budget.amount - totalSpent
        };
      }
    }

    res.status(201).json({
      expense,
      budgetStatus
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.userId });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};