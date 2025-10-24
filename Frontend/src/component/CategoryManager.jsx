import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/v1/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return toast.error("Enter category name");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/v1/categories",
        { name: newCat },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category added!");
      setNewCat("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error adding category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center mb-4">Category Management</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add custom category"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {categories.map((cat, idx) => (
          <li
            key={idx}
            className="p-2 border rounded bg-gray-50 flex justify-between"
          >
            <span>{cat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
