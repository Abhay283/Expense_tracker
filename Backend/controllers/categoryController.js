import Category from "../models/categoryModel.js";

// ✅ Get all categories (default + user custom)
export const getAllCategories = async (req, res) => {
  try {
    const defaultCategories = await Category.find({ isDefault: true });
    const userCategories = await Category.find({ user: req.user.id, isDefault: false });
    res.status(200).json([...defaultCategories, ...userCategories]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Add custom category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Category name required" });

    const existing = await Category.findOne({ name, user: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: "Category already exists" });

    const newCategory = await Category.create({
      name,
      user: req.user.id,
      isDefault: false
    });

    res.status(201).json({ success: true, data: newCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
