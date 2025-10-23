import Expense from "../models/expense.js";

// CREATE
export const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const expense = new Expense({
      user: req.user.id,
      amount,
      category,
      description,
      date,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// READ
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ msg: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ msg: "Expense not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
