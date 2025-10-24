import Category from "../models/categoryModel.js";

// ✅ Get all categories (Default + User Custom)
export const getAllCategories = async (req, res) => {
  try {
    // Default categories (static list)
    const defaultCategories = [
      "Food & Dining",
      "Transportation",
      "Entertainment",
      "Shopping",
      "Bills & Utilities",
      "Healthcare",
      "Education",
      "Other",
    ];

    // Custom categories from DB
    const userCategories = await Category.find({ user: req.user.id }).select("name");

    const allCategories = [
      ...defaultCategories,
      ...userCategories.map((cat) => cat.name),
    ];

    res.status(200).json({ success: true, categories: allCategories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Add custom category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });

    // Prevent duplicates (same user)
    const existing = await Category.findOne({ name, user: req.user.id });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });

    const newCategory = new Category({
      name,
      user: req.user.id,
    });

    await newCategory.save();

    res.status(201).json({ success: true, data: newCategory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
