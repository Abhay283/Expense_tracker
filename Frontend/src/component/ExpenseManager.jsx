import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./ExpenseForm";

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  // ✅ Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Add or Update expense
  const handleFormSubmit = async (data) => {
    const token = localStorage.getItem("token");
    try {
      if (editingExpense) {
        // Update
        const res = await axios.put(
          `http://localhost:5000/api/expenses/${editingExpense._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses(expenses.map((exp) => (exp._id === editingExpense._id ? res.data.data : exp)));
        setEditingExpense(null);
        alert("Expense updated successfully!");
      } else {
        // Add
        const res = await axios.post("http://localhost:5000/api/expenses", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses([res.data.data, ...expenses]);
        alert("Expense added successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving expense");
    }
  };

  // ✅ Edit
  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((exp) => exp._id !== id));
      alert("Deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting expense");
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Expense Manager</h1>

      {/* Add / Edit Form */}
      <ExpenseForm onSubmit={handleFormSubmit} editingExpense={editingExpense} />

      {/* Expense Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp) => (
                <tr key={exp._id} className="text-center">
                  <td className="border px-2 py-1">{exp.amount}</td>
                  <td className="border px-2 py-1">{exp.category?.name || "N/A"}</td>
                  <td className="border px-2 py-1">{exp.description}</td>
                  <td className="border px-2 py-1">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="border px-2 py-1 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exp._id)}
                      className="bg-red-500 px-2 py-1 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  No expenses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseManager;
