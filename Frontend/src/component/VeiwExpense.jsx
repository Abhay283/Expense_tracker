import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Expenses.css";

const ViewExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = JSON.parse(localStorage.getItem("auth"))?.token || "";

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/expenses?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error("Failed to fetch expenses");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted successfully");
      fetchExpenses();
    } catch {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => { fetchExpenses(); }, [page]);

  return (
    <div className="expenses-table-container">
      <h2>View Expenses</h2>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp._id}>
              <td>{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{exp.description}</td>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => toast.info("Edit modal here")}>Edit</button>
                <button onClick={() => handleDelete(exp._id)}>Delete</button>
                {exp.receipt && <a href={exp.receipt} target="_blank" rel="noreferrer">View Receipt</a>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default ViewExpenses;
