// src/App.js - FIXED (No page reloads)
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import VideoDemo from './components/Videodemo';
import Features from './components/Features';
import Platform from './components/platform';
import Future from './components/Future';
import CTA from './components/CTA';
import Chatbot from './components/Chatbot';
import { LanguageProvider } from './context/LanguageContext';
import { ContentProvider } from './context/ContentContext';
import { authAPI } from './services/api';
import { clearAuth } from './services/auth';
import './index.css';

// Component to listen for auth failures and redirect without page reload
const AuthHandler = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthFailure = () => {
      console.log('🔐 Auth failure detected, redirecting to login...');
      navigate('/admin/login', { replace: true });
    };
    
    window.addEventListener('auth-failure', handleAuthFailure);
    return () => window.removeEventListener('auth-failure', handleAuthFailure);
  }, [navigate]);
  
  return null;
};

// Admin Components
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./admin/Dashboard'));
const ContentEditor = React.lazy(() => import('./admin/ContentEditor'));
const FeaturesEditor = React.lazy(() => import('./admin/FeaturesEditor'));
const SectionBulletEditor = React.lazy(() => import('./admin/SectionBulletEditor'));
const VisionSectionsEditor = React.lazy(() => import('./admin/VisionSectionsEditor'));
const CTASectionsEditor = React.lazy(() => import('./admin/CTASectionsEditor'));

// Protected Route Component - verifies token validity with caching
const VERIFY_CACHE_KEY = 'tokenVerifiedAt';
const VERIFY_CACHE_DURATION = 55 * 60 * 1000; // 55 minutes (just under 1hr JWT expiry)

// Check cache synchronously to avoid spinner flash
const isCacheValid = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;
  
  const lastVerified = sessionStorage.getItem(VERIFY_CACHE_KEY);
  if (!lastVerified) return false;
  
  const timeSinceVerify = Date.now() - parseInt(lastVerified, 10);
  return timeSinceVerify < VERIFY_CACHE_DURATION;
};

const ProtectedRoute = ({ children }) => {
  // Initialize state based on cache - no spinner if cache is valid
  const token = localStorage.getItem('adminToken');
  const cacheValid = isCacheValid();
  
  const [isVerifying, setIsVerifying] = useState(!cacheValid && !!token);
  const [isValid, setIsValid] = useState(cacheValid);

  useEffect(() => {
    // If cache was valid on mount, we're already good
    if (cacheValid) return;
    
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setIsValid(false);
        return;
      }

      try {
        await authAPI.verify();
        sessionStorage.setItem(VERIFY_CACHE_KEY, Date.now().toString());
        setIsValid(true);
      } catch (error) {
        console.log('Token expired or invalid, clearing auth...');
        sessionStorage.removeItem(VERIFY_CACHE_KEY);
        clearAuth();
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, cacheValid]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-emerald-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  return isValid ? children : <Navigate to="/admin/login" />;
};

// Loading component
const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
      <p className="mt-4 text-emerald-600">Loading Admin Panel...</p>
    </div>
  </div>
);

// Main Landing Page Component
const LandingPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 overflow-x-hidden">
        <Header />
        <Hero />
        <VideoDemo />
        <Features />
        <Platform />
        <Future />
        <CTA />
      </div>
      <Chatbot />
    </>
  );
};

function App() {
  useEffect(() => {
    console.log('🚀 App mounted at:', new Date().toLocaleTimeString());
  }, []);
  
  return (
    <LanguageProvider>
      <ContentProvider>
        <Router>
          <AuthHandler />
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/login" 
              element={
                <React.Suspense fallback={<AdminLoading />}>
                  <AdminLogin />
                </React.Suspense>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <React.Suspense fallback={<AdminLoading />}>
                    <AdminLayout />
                  </React.Suspense>
                </ProtectedRoute>
              }
            >
              {/* Nested admin routes */}
              <Route index element={
                <React.Suspense fallback={<AdminLoading />}>
                  <Dashboard />
                </React.Suspense>
              } />
              <Route path="content" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <ContentEditor />
                </React.Suspense>
              } />
              <Route path="sections" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <SectionBulletEditor />
                </React.Suspense>
              } />
              <Route path="features" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <FeaturesEditor />
                </React.Suspense>
              } />
              <Route path="vision" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <VisionSectionsEditor />
                </React.Suspense>
              } />
              <Route path="cta" element={
                <React.Suspense fallback={<AdminLoading />}>
                  <CTASectionsEditor />
                </React.Suspense>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ContentProvider>
    </LanguageProvider>
  );
}

export default App;