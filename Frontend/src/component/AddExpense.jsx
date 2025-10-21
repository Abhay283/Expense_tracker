import React, { useState,useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export default function AddExpense() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // today
    receipt: ""
  });

  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token"); // JWT from login

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data.data); // update table
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.amount || form.amount <= 0) return toast.error("Amount must be greater than 0");
    if (!form.category) return toast.error("Category is required");
    if (new Date(form.date) > new Date()) return toast.error("Date cannot be in future");

    try {

      const res = await fetch("http://localhost:3000/api/v1/expenses", form, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      toast.success("Expense added successfully!");
      setForm({ amount: "", category: "", description: "", date: new Date().toISOString().split("T")[0], receipt: "" });
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Server error");
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" name="description" placeholder="Description (optional)" value={form.description} onChange={handleChange} />
        <input type="date" name="date" value={form.date} onChange={handleChange} />
        <button type="submit">Add Expense</button>
      </form>
      <h2>Your Expenses</h2>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{exp.description}</td>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
