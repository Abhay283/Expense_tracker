import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    customCategory: ""
  });

  const [categories, setCategories] = useState([]);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit expense with optional custom category
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      let categoryId = form.category;

      // Add custom category first if entered
      if (form.customCategory) {
        const res = await axios.post(
          "http://localhost:5000/api/categories",
          { name: form.customCategory },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        categoryId = res.data.data._id;
      }

      // Call parent onSubmit
      onSubmit({ ...form, category: categoryId });

      setForm({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        customCategory: ""
      });

      fetchCategories(); // refresh categories
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding expense");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      <input
        type="text"
        name="customCategory"
        placeholder="Or add custom category"
        value={form.customCategory}
        onChange={handleChange}
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Expense
      </button>
    </form>
  );
}
