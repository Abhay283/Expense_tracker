import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../component/ThemeToggle';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password)
      return setError('Enter email and password');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return setError('Google Client ID not configured in .env');

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
        },
      });

      window.google.accounts.id.prompt();
    } else {
      setError('Google SDK not loaded yet. Refresh and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black relative">
      {/* Toggle Theme Button */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/40 dark:bg-white/5 rounded-lg">
            <LogIn className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Log in to continue tracking your expenses
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100/60 dark:bg-red-900/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 text-gray-800 dark:text-gray-100 placeholder-gray-400"
              placeholder="you@domain.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 text-gray-800 dark:text-gray-100 placeholder-gray-400"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-2 p-1 text-gray-600 dark:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-gray-300 dark:border-gray-700" />
            <span className="text-sm text-gray-400 dark:text-gray-500">or</span>
            <hr className="flex-1 border-gray-300 dark:border-gray-700" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg py-2 flex items-center justify-center gap-3 hover:shadow-lg transition"
          >
            <img src="/google-logo.svg" alt="google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
              Continue with Google
            </span>
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
