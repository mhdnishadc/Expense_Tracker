const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getMonthlyReport } = require('../controllers/reportController');

router.use(authMiddleware);

router.get('/monthly', getMonthlyReport);

module.exports = router;