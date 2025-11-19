const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getExpenses,
  createExpense,
  deleteExpense
} = require('../controllers/expenseController');

router.use(authMiddleware);

router.get('/', getExpenses);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);

module.exports = router;