import React, { useState, useEffect } from 'react';
import { Calendar, Filter, X, DollarSign, TrendingUp, PieChart, LogOut, Search, Edit, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import ThemeToggle from '../component/ThemeToggle';
import { BarChart, PieChart as PieChartComp, LineChart } from '../component/Charts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: 'All',
    search: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters]);

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get('/expenses');
      setExpenses(data.expenses);
      setLoading(false);
    } catch {
      console.error('Failed to fetch expenses');
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await API.get('/dashboard/summary');
      setSummary(data);
    } catch {
      console.error('Failed to fetch summary');
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];
    if (filters.startDate)
      filtered = filtered.filter(exp => new Date(exp.date) >= new Date(filters.startDate));
    if (filters.endDate)
      filtered = filtered.filter(exp => new Date(exp.date) <= new Date(filters.endDate));
    if (filters.category !== 'All')
      filtered = filtered.filter(exp => exp.category === filters.category);
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(search) ||
        exp.description?.toLowerCase().includes(search)
      );
    }
    setFilteredExpenses(filtered);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await API.put(`/expenses/${editingId}`, formData);
      } else {
        await API.post('/expenses', formData);
      }
      resetForm();
      fetchExpenses();
      fetchSummary();
    } catch {
      alert('Operation failed');
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description || ''
    });
    setEditingId(expense._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await API.delete(`/expenses/${id}`);
        fetchExpenses();
        fetchSummary();
      } catch {
        alert('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      category: 'All',
      search: ''
    });
  };

  const calculateTotal = () =>
    filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-orange-500',
      Transport: 'bg-blue-500',
      Shopping: 'bg-purple-500',
      Bills: 'bg-red-500',
      Entertainment: 'bg-pink-500',
      Health: 'bg-green-500',
      Other: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-all">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">💰 Expense Tracker</h1>
              <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                {showForm ? 'Close' : 'Add'}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard color="from-blue-500 to-blue-600" title="Total" icon={<TrendingUp />} value={summary.totalExpenses} />
            <SummaryCard color="from-green-500 to-green-600" title="Average" icon={<DollarSign />} value={summary.averageExpense} />
            <SummaryCard color="from-purple-500 to-purple-600" title="Count" icon={<PieChart />} value={summary.totalCount} />
            <SummaryCard color="from-orange-500 to-orange-600" title="This Month" icon={<Calendar />} value={Object.values(summary.monthlyBreakdown)[5] || 0} />
          </div>
        )}

        {/* Charts */}
        {summary && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow lg:col-span-2">
              <h3 className="font-semibold mb-3 dark:text-gray-100">Monthly Spending (Last 6 Months)</h3>
              <BarChart labels={Object.keys(summary.monthlyBreakdown)} data={Object.values(summary.monthlyBreakdown)} />
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3 dark:text-gray-100">Category Breakdown</h3>
              <PieChartComp labels={Object.keys(summary.categoryBreakdown)} data={Object.values(summary.categoryBreakdown)} />
              <div className="mt-4">
                <h4 className="font-semibold mb-2 dark:text-gray-100">Trend</h4>
                <LineChart labels={Object.keys(summary.monthlyBreakdown)} data={Object.values(summary.monthlyBreakdown)} />
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <ExpenseForm
            formData={formData}
            setFormData={setFormData}
            editingId={editingId}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ color, title, icon, value }) => (
  <div className={`bg-gradient-to-br ${color} rounded-lg shadow-lg p-6 text-white`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-blue-100">{title}</span>
      <div>{icon}</div>
    </div>
    <p className="text-3xl font-bold">₹{Number(value).toFixed(2)}</p>
  </div>
);

const ExpenseForm = ({ formData, setFormData, editingId, handleSubmit, resetForm, categories }) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {['title', 'amount', 'date'].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{field}</label>
          <input
            type={field === 'amount' ? 'number' : field === 'date' ? 'date' : 'text'}
            value={formData[field]}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        {editingId ? 'Update' : 'Add'}
      </button>
      {editingId && (
        <button onClick={resetForm} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
          Cancel
        </button>
      )}
    </div>
  </div>
);

export default Dashboard;
