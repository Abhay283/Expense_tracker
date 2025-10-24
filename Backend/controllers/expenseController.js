import expense from "../models/expense.js";
import Category from "../models/categoryModel.js";

// ➕ Create expense
export const createExpense = async (req, res) => {
  try {
    const newExpense = await expense.create({ ...req.body, user: req.user.id });
    const populatedExpense = await newExpense.populate("category", "name"); // populate category name
    res.status(201).json({ success: true, data: populatedExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📃 Get all expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await expense
      .find({ user: req.user.id })
      .sort({ date: -1 })
      .populate("category", "name"); // populate category name
    res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔍 Get single expense
export const getExpenseById = async (req, res) => {
  try {
    const singleExpense = await expense.findById(req.params.id).populate("category", "name");
    if (!singleExpense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ success: true, data: singleExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update expense
export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await expense
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("category", "name");
    res.status(200).json({ success: true, data: updatedExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ❌ Delete expense
export const deleteExpense = async (req, res) => {
  try {
    await expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
