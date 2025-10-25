const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

router.get('/summary', expenseController.getDashboardSummary);
router.get('/monthly', expenseController.getMonthlyStats);

module.exports = router;