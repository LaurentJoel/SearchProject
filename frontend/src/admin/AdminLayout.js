// src/admin/AdminLayout.js - FINAL FIX (NO AUTO-REFRESH)
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileEdit, 
  Settings, 
  LogOut, 
  Home,
  X,
  Menu,
  User,
  RefreshCw,
  Sparkles,
  Megaphone,
  List
} from 'lucide-react';
import { clearAuth, getCurrentUser } from '../services/auth';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const hasCheckedAuth = useRef(false);

  // Check auth ONLY ONCE on mount
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/admin/login');
    } else {
      setUser(currentUser);
    }
  }, []); // Empty deps = runs ONLY ONCE

  const handleLogout = () => {
    clearAuth();
    navigate('/admin/login');
  };

  const handleRefreshFrontend = () => {
    console.log('🔄 [AdminLayout] Manual refresh triggered');
    
    // Dispatch multiple events to ensure frontend catches it
    window.dispatchEvent(new Event('content-refresh'));
    window.dispatchEvent(new Event('refresh-content'));
    window.postMessage({ type: 'REFRESH_CONTENT' }, '*');
    
    // Show success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = '✅ Frontend refreshed! Check your website.';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard />, label: 'Dashboard', exact: true },
    { path: '/admin/content', icon: <FileEdit />, label: 'Content Editor' },
    { path: '/admin/sections', icon: <List />, label: 'Section Bullets' },
    { path: '/admin/features', icon: <Settings />, label: 'Features' },
    { path: '/admin/vision', icon: <Sparkles />, label: 'Vision Sections' },
    { path: '/admin/cta', icon: <Megaphone />, label: 'CTA Sections' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className={`
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative z-40 bg-white/95 backdrop-blur-sm border-r border-green-100
        text-gray-800 transition-all duration-300 flex flex-col h-screen
      `}>
        <div className="p-6 border-b border-green-100">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/admin')}>
            <div className="relative">
              <FileEdit className="h-8 w-8 text-green-600" />
              <div className="absolute -inset-2 bg-green-100 rounded-full blur opacity-50"></div>
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="text-xl font-bold text-green-800">Admin Panel</h2>
                <p className="text-green-600 text-sm">Search Engine</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                    : 'hover:bg-green-50 text-gray-600 hover:text-green-700'
                }`
              }
            >
              <span className="transition-transform duration-200">
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-green-100 space-y-4">
          {user && sidebarOpen && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">{user.username}</p>
                  <p className="text-green-600 text-sm">Administrator</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={handleRefreshFrontend}
              className="flex items-center w-full px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
            >
              <RefreshCw className="mr-3" />
              {sidebarOpen && 'Refresh Frontend'}
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
            >
              <LogOut className="mr-3" />
              {sidebarOpen && 'Logout'}
            </button>
            
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg transition duration-200"
            >
              <Home className="mr-3" />
              {sidebarOpen && 'View Website'}
            </Link>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;