const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getBudgets,
  createOrUpdateBudget,
  deleteBudget
} = require('../controllers/budgetController');

router.use(authMiddleware);

router.get('/', getBudgets);
router.post('/', createOrUpdateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;