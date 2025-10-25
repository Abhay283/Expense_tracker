const Expense = require('../models/expense');

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    // Validate required fields
    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const expense = new Expense({
      userId: req.userId,
      title,
      amount,
      category,
      date,
      description
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    console.error('Create Expense Error:', error);
    res.status(500).json({ error: 'Server error while creating expense' });
  }
};

// @desc    Get all expenses with filters
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category, search } = req.query;

    let query = { userId: req.userId };

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: expenses.length,
      expenses
    });
  } catch (error) {
    console.error('Get Expenses Error:', error);
    res.status(500).json({ error: 'Server error while fetching expenses' });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({
      success: true,
      expense
    });
  } catch (error) {
    console.error('Get Expense Error:', error);
    res.status(500).json({ error: 'Server error while fetching expense' });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, amount, category, date, description },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({
      success: true,
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    console.error('Update Expense Error:', error);
    res.status(500).json({ error: 'Server error while updating expense' });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({ error: 'Server error while deleting expense' });
  }
};

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
exports.getDashboardSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });

    // Total expenses
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Category breakdown
    const categoryBreakdown = {};
    expenses.forEach(exp => {
      if (!categoryBreakdown[exp.category]) {
        categoryBreakdown[exp.category] = 0;
      }
      categoryBreakdown[exp.category] += exp.amount;
    });

    // Monthly breakdown (last 6 months)
    const monthlyData = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = 0;
    }

    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      const monthKey = expDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += exp.amount;
      }
    });

    res.json({
      success: true,
      totalExpenses,
      totalCount: expenses.length,
      averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      categoryBreakdown,
      monthlyBreakdown: monthlyData
    });
  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    res.status(500).json({ error: 'Server error while fetching dashboard summary' });
  }
};

// @desc    Get monthly stats
// @route   GET /api/dashboard/monthly
// @access  Private
exports.getMonthlyStats = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year || new Date().getFullYear();
    const currentMonth = month || new Date().getMonth() + 1;

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({
      success: true,
      month: startDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
      total,
      count: expenses.length,
      expenses
    });
  } catch (error) {
    console.error('Monthly Stats Error:', error);
    res.status(500).json({ error: 'Server error while fetching monthly stats' });
  }
};