import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


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
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
<div className="flex items-center gap-4 mb-6">
<div className="p-3 bg-blue-50 rounded-lg">
<Check className="w-6 h-6 text-blue-600" />
</div>
<div>
<h2 className="text-2xl font-semibold text-gray-800">Create account</h2>
<p className="text-sm text-gray-500">Start tracking your expenses in seconds</p>
</div>
</div>


{error && (
<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
{error}
</div>
)}

<form onSubmit={handleSubmit} className="space-y-4">
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
<div className="relative">
<input
type="text"
value={formData.name}
onChange={(e) => setFormData({ ...formData, name: e.target.value })}
className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
placeholder="Your name"
/>
</div>
</div>


<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
<input
type="email"
value={formData.email}
onChange={(e) => setFormData({ ...formData, email: e.target.value })}
className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
placeholder="you@domain.com"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
<div className="relative">
<input
type={showPassword ? 'text' : 'password'}
value={formData.password}
onChange={(e) => setFormData({ ...formData, password: e.target.value })}
className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
placeholder="Create a password"
/>
<button
type="button"
onClick={() => setShowPassword((s) => !s)}
className="absolute right-2 top-2 p-1"
aria-label="Toggle password visibility"
>
{showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
</button>
</div>
<p className="text-xs text-gray-400 mt-1">Minimum 6 characters.</p>
</div>


<button
type="submit"
disabled={loading}
className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold disabled:opacity-60"
>
{loading ? 'Creating account...' : 'Create account'}
</button>

<div className="flex items-center gap-3">
<hr className="flex-1 border-gray-200" />
<span className="text-sm text-gray-400">or</span>
<hr className="flex-1 border-gray-200" />
</div>


<div className="grid grid-cols-1 gap-3">
<button type="button" onClick={handleGoogle} className="w-full border border-gray-200 rounded-lg py-2 flex items-center justify-center gap-3 hover:shadow">
<img src="/google-logo.svg" alt="google" className="w-5 h-5" />
<span className="text-sm font-medium">Continue with Google</span>
</button>
</div>


<p className="text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="text-blue-600 font-medium">Sign in</Link></p>
</form>
</div>
</div>
);
};


export default Register;