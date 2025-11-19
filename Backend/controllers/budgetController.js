const Budget = require('../models/Budget');
const Category = require('../models/Category');

exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.userId };
    
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const budgets = await Budget.find(query).populate('categoryId');
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createOrUpdateBudget = async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;

    // Check if category belongs to user
    const category = await Category.findOne({ _id: categoryId, userId: req.userId });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const budget = await Budget.findOneAndUpdate(
      { categoryId, userId: req.userId, month, year },
      { amount },
      { new: true, upsert: true }
    ).populate('categoryId');

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndDelete({ _id: id, userId: req.userId });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};