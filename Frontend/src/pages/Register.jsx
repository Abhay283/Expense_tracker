import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../component/ThemeToggle';


const Register = () => {
const [formData, setFormData] = useState({ name: '', email: '', password: '' });
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const { register, googleSignIn } = useAuth();
const navigate = useNavigate();

useEffect(() => {
// Load Google Identity Services script if client id is provided
if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
const id = 'gsi-script';
if (!document.getElementById(id)) {
const s = document.createElement('script');
s.src = 'https://accounts.google.com/gsi/client';
s.id = id;
s.async = true;
s.defer = true;
document.body.appendChild(s);
}
}
}, []);

const validate = () => {
if (!formData.name.trim()) return 'Name is required';
if (!formData.email.match(/\S+@\S+\.\S+/)) return 'Valid email is required';
if (formData.password.length < 6) return 'Password must be at least 6 characters';
return null;
};


const handleSubmit = async (e) => {
e.preventDefault();
setError('');
const v = validate();
if (v) return setError(v);
setLoading(true);
try {
await register(formData.name, formData.email, formData.password);
navigate('/dashboard');
} catch (err) {
setError(err.response?.data?.error || 'Registration failed');
}
setLoading(false);
};

const handleGoogle = () => {
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) return setError('Google Client ID not configured in .env');


/*
Use Google Identity Services to get an id_token, then send it to backend.
Backend should verify token and create / return user session.
*/
if (window.google && window.google.accounts) {
window.google.accounts.id.initialize({
client_id: clientId,
callback: async (res) => {
try {
setLoading(true);
await googleSignIn(res.credential);
navigate('/dashboard');
} catch (err) {
setError('Google sign-in failed');
} finally {
setLoading(false);
}
}
});

window.google.accounts.id.prompt();
} else {
setError('Google SDK not loaded yet. Refresh and try again.');
}
};


return (
<div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black transition-all">
      {/* 🌗 Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/40 dark:bg-white/5 rounded-lg">
            <Check className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Create account</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">Start tracking your expenses in seconds</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="you@domain.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/70 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-2 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Minimum 6 characters.</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold disabled:opacity-60 shadow-md hover:shadow-lg transition"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-gray-300 dark:border-gray-700" />
            <span className="text-sm text-gray-400 dark:text-gray-500">or</span>
            <hr className="flex-1 border-gray-300 dark:border-gray-700" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg py-2 flex items-center justify-center gap-3 hover:shadow-lg dark:hover:shadow-gray-800 transition bg-white/60 dark:bg-gray-800/50"
          >
            <img src="/google-logo.svg" alt="google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Continue with Google</span>
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;