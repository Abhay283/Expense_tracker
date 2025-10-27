import React, { useState, useEffect } from 'react';
import { Calendar, Filter, X, DollarSign, TrendingUp, PieChart, LogOut, Search, Edit, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

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
      const { data } = await API.get('/expenses', { params: filters });
      setExpenses(data.expenses);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch expenses');
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await API.get('/dashboard/summary');
      setSummary(data);
    } catch (error) {
      console.error('Failed to fetch summary');
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    if (filters.startDate) {
      filtered = filtered.filter(exp => new Date(exp.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(exp => new Date(exp.date) <= new Date(filters.endDate));
    }
    if (filters.category !== 'All') {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }
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
    } catch (error) {
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
      } catch (error) {
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

  const calculateTotal = () => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">💰 Expense Tracker</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100">Total</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">₹{summary.totalExpenses.toFixed(2)}</p>
            </div>

            <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-100">Average</span>
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">₹{summary.averageExpense.toFixed(2)}</p>
            </div>

            <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100">Count</span>
                <PieChart className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">{summary.totalCount}</p>
            </div>

            <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-100">This Month</span>
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold">
                ₹{Object.values(summary.monthlyBreakdown)[5]?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        )}

        {/* Add/Edit Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              {showForm ? 'Close' : 'Add Expense'}
            </button>
          </div>

          {showForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Expense title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)*</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editingId ? 'Update' : 'Add'} Expense
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <PieChart className="w-4 h-4" />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Search className="w-4 h-4" />
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Search title or description"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
              Reset Filters
            </button>
          </div>

          {(filters.startDate || filters.endDate || filters.category !== 'All' || filters.search) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.startDate && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    From: {new Date(filters.startDate).toLocaleDateString()}
                  </span>
                )}
                {filters.endDate && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    To: {new Date(filters.endDate).toLocaleDateString()}
                  </span>
                )}
                {filters.category !== 'All' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {filters.category}
                  </span>
                )}
                {filters.search && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Search: "{filters.search}"
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Expense List
              {(filters.startDate || filters.endDate || filters.category !== 'All' || filters.search) && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredExpenses.length} of {expenses.length})
                </span>
              )}
            </h2>
            <div className="text-lg font-bold text-gray-800">
              Total: ₹{calculateTotal().toFixed(2)}
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">
                {expenses.length === 0 ? 'No expenses added yet' : 'No expenses match your filters'}
              </p>
              {expenses.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map(expense => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 ${getCategoryColor(expense.category)} rounded-lg flex items-center justify-center text-white font-bold`}>
                      {expense.category[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{expense.title}</h3>
                      {expense.description && (
                        <p className="text-sm text-gray-500">{expense.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className={`px-2 py-1 ${getCategoryColor(expense.category)} bg-opacity-10 rounded text-xs font-medium`}>
                          {expense.category}
                        </span>
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold text-gray-800">₹{expense.amount.toFixed(2)}</p>
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        {summary && filteredExpenses.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(summary.categoryBreakdown).map(([category, amount]) => (
                <div key={category} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 ${getCategoryColor(category)} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                  </div>
                  <p className="text-lg font-bold text-gray-800">₹{amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">
                    {((amount / summary.totalExpenses) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Breakdown */}
        {summary && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Breakdown (Last 6 Months)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(summary.monthlyBreakdown).map(([month, amount]) => (
                <div key={month} className="p-4 bg-linear-to-br from-indigo-50 to-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 mb-1">{month}</p>
                  <p className="text-xl font-bold text-gray-800">₹{amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;