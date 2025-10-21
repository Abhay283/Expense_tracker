import expense from "../models/expense.js";  

// ➕ Create expense
export const createExpense = async (req, res) => {
  try {
    const newExpense = await expense.create(req.body);
    res.status(201).json({ success: true, data: newExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📃 Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const expenses = await expense.find({ user: req.user.id })
      .sort({ date: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    const total = await expense.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 Get one expense
export const getExpenseById = async (req, res) => {
  try {
    const singleExpense = await expense.findById(req.params.id);
    if (!singleExpense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ success: true, data: singleExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update expense
export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedExpense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ success: true, data: updatedExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ❌ Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedExpense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
