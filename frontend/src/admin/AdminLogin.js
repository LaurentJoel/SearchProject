// src/admin/AdminLogin.js - FIXED (No Refresh Loop)
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { setAuth, isAuthenticated } from '../services/auth';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hasCheckedAuth = useRef(false);

  // Check authentication ONLY ONCE on mount
  useEffect(() => {
    // Prevent multiple checks
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    // If already authenticated, redirect silently
    if (isAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, []); // Empty deps = runs only once

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      const { access_token, username: user } = response.data;

      // Save auth data
      setAuth(access_token, { username: user, role: 'Administrator' });
      
      // Navigate WITHOUT causing a refresh (replace: true prevents back button issues)
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Connection error. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Green Header */}
          <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 px-8 pt-10 pb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-white border-opacity-30 flex items-center justify-center">
                <Search className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Portal</h1>
            <p className="text-green-100 text-sm">Search Engine Presentation</p>
          </div>

          {/* Form Body */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail className="w-5 h-5 text-green-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    disabled={loading}
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                  <Lock className="w-4 h-4 mr-2 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-green-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Back to Website */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;