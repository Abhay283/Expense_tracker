// controllers/expenseController.js
const Expense = require('../models/expense');

// Create
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;
    if (!title || amount == null || !category || !date) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const expense = new Expense({
      userId: req.userId,
      title,
      amount: Number(amount),
      category,
      date: new Date(date),
      description
    });

    await expense.save();

    res.status(201).json({ success: true, message: 'Expense created successfully', expense });
  } catch (error) {
    console.error('Create Expense Error:', error);
    res.status(500).json({ error: 'Server error while creating expense' });
  }
};

// Get all
exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category, search } = req.query;
    let query = { userId: req.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json({ success: true, count: expenses.length, expenses });
  } catch (error) {
    console.error('Get Expenses Error:', error);
    res.status(500).json({ error: 'Server error while fetching expenses' });
  }
};

// Get single
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true, expense });
  } catch (error) {
    console.error('Get Expense Error:', error);
    res.status(500).json({ error: 'Server error while fetching expense' });
  }
};

// Update
exports.updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, amount: Number(amount), category, date: new Date(date), description },
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true, message: 'Expense updated successfully', expense });
  } catch (error) {
    console.error('Update Expense Error:', error);
    res.status(500).json({ error: 'Server error while updating expense' });
  }
};

// Delete
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({ error: 'Server error while deleting expense' });
  }
};

// Dashboard summary + monthly functions (you already had)
exports.getDashboardSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });

    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    // Category breakdown
    const categoryBreakdown = {};
    expenses.forEach(exp => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + (exp.amount || 0);
    });

    // Monthly last 6 months
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
      if (monthlyData.hasOwnProperty(monthKey)) monthlyData[monthKey] += exp.amount || 0;
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

exports.getMonthlyStats = async (req, res) => {
  try {
    const { year, month } = req.query;
    const currentYear = year ? Number(year) : new Date().getFullYear();
    const currentMonth = month ? Number(month) : new Date().getMonth() + 1;

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    const expenses = await Expense.find({ userId: req.userId, date: { $gte: startDate, $lte: endDate } });
    const total = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

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
